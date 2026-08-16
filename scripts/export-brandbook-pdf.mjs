#!/usr/bin/env node
/**
 * Export brandbook print view to PDF on Desktop (uses system Chrome + CDP).
 *
 * Modes:
 *   unified (default) — complete A4 document, natural page flow
 *   sections          — each chapter starts on a new page
 *   continuous        — single long page (may truncate in some viewers)
 *
 * Usage:
 *   node scripts/export-brandbook-pdf.mjs
 *   BRANDBOOK_PDF_MODE=sections node scripts/export-brandbook-pdf.mjs
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const ADMIN = join(ROOT, "admin");
const PORT = process.env.BRANDBOOK_PORT || "3003";
const MODE = ["sections", "continuous"].includes(process.env.BRANDBOOK_PDF_MODE)
  ? process.env.BRANDBOOK_PDF_MODE
  : "unified";
const PRINT_URL = `http://127.0.0.1:${PORT}/admin/brandbook/print?mode=${MODE}`;
const OUTPUT = join(
  homedir(),
  "Desktop",
  process.env.BRANDBOOK_PDF_NAME ||
    (MODE === "unified"
      ? "CHHome-Brandbook-v1.0.0.pdf"
      : MODE === "sections"
        ? "CHHome-Brandbook-v1.0.0-sections.pdf"
        : "CHHome-Brandbook-v1.0.0-continuous.pdf"),
);

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
];

function findChrome() {
  return CHROME_CANDIDATES.find((path) => existsSync(path));
}

async function waitForServer(maxMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(PRINT_URL, { redirect: "follow" });
      if (res.ok) return;
    } catch {
      // retry
    }
    await sleep(1500);
  }
  throw new Error(`Admin server not ready at ${PRINT_URL}`);
}

async function waitForChromeDebug(port, maxMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return true;
    } catch {
      // retry
    }
    await sleep(400);
  }
  return false;
}

function startDevServer() {
  return spawn("npm", ["run", "dev"], {
    cwd: ADMIN,
    stdio: "pipe",
    env: { ...process.env },
  });
}

function cdpSend(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1e9);
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id !== id) return;
      ws.removeEventListener("message", handler);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const CSS_PX_PER_INCH = 96;
const A4_WIDTH_IN = 8.27;
const A4_HEIGHT_IN = 11.69;

async function waitForPrintReady(ws) {
  const result = await cdpSend(ws, "Runtime.evaluate", {
    expression: `
      new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          if (document.documentElement.dataset.printReady === "true") {
            resolve(true);
            return;
          }
          if (Date.now() - start > 90000) {
            resolve(false);
            return;
          }
          setTimeout(check, 250);
        };
        check();
      })
    `,
    awaitPromise: true,
  });
  return Boolean(result.result?.value);
}

async function measureContentHeightPx(ws) {
  let heightPx = 0;
  for (let i = 0; i < 4; i += 1) {
    const heightResult = await cdpSend(ws, "Runtime.evaluate", {
      expression: `
        (() => {
          const root = document.querySelector(".brandbook-print-document");
          document.documentElement.style.height = "auto";
          document.documentElement.style.minHeight = "0";
          document.body.style.height = "auto";
          document.body.style.minHeight = "0";
          if (root) {
            root.style.height = "auto";
            root.style.minHeight = "0";
          }
          const node = root || document.body;
          const rect = node.getBoundingClientRect();
          return Math.ceil(Math.max(
            rect.height,
            node.scrollHeight,
            node.offsetHeight,
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          ));
        })()
      `,
      returnByValue: true,
    });
    heightPx = heightResult.result?.value || heightPx;
    await sleep(400);
  }
  return heightPx;
}

async function exportWithCdp(chromePath, url, outputPath, mode) {
  const debugPort = 9222 + Math.floor(Math.random() * 200);
  const chrome = spawn(
    chromePath,
    [
      `--remote-debugging-port=${debugPort}`,
      "--remote-allow-origins=*",
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  await sleep(2000);

  try {
    if (!(await waitForChromeDebug(debugPort))) {
      throw new Error("Chrome debug port unavailable");
    }

    const created = await fetch(
      `http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(url)}`,
      { method: "PUT" },
    );
    const target = await created.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });

    await cdpSend(ws, "Page.enable");
    await cdpSend(ws, "Runtime.enable");

    const paperWidthPx = Math.round(A4_WIDTH_IN * CSS_PX_PER_INCH);
    await cdpSend(ws, "Emulation.setDeviceMetricsOverride", {
      width: paperWidthPx,
      height: Math.round(A4_HEIGHT_IN * CSS_PX_PER_INCH),
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdpSend(ws, "Emulation.setEmulatedMedia", {
      media: "print",
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });

    await sleep(2000);
    await waitForPrintReady(ws);
    await sleep(800);

    const contentHeightPx = await measureContentHeightPx(ws);
    console.log(`Measured content height: ${contentHeightPx}px`);

    const isContinuous = mode === "continuous";
    const marginIn = isContinuous ? 0 : 0.39;
    const paperHeight = isContinuous
      ? Math.max(contentHeightPx / CSS_PX_PER_INCH, 4) + 0.08
      : A4_HEIGHT_IN;

    const pdf = await cdpSend(ws, "Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: !isContinuous,
      paperWidth: A4_WIDTH_IN,
      paperHeight,
      marginTop: marginIn,
      marginBottom: marginIn,
      marginLeft: marginIn,
      marginRight: marginIn,
      scale: 1,
      displayHeaderFooter: false,
    });

    writeFileSync(outputPath, Buffer.from(pdf.data, "base64"));
    ws.close();
  } finally {
    chrome.kill("SIGTERM");
  }
}

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    throw new Error("Google Chrome not found. Install Chrome or set CHROME_PATH.");
  }

  let child;
  let startedLocally = false;

  try {
    await waitForServer(3000);
    console.log(`Using existing server: ${PRINT_URL}`);
  } catch {
    console.log(`Starting admin dev server on :${PORT}...`);
    child = startDevServer();
    startedLocally = true;
    child.stdout?.on("data", (d) => process.stdout.write(d));
    child.stderr?.on("data", (d) => process.stderr.write(d));
    await waitForServer();
  }

  console.log(`Generating PDF (${MODE} mode)...`);
  await exportWithCdp(chrome, PRINT_URL, OUTPUT, MODE);

  if (MODE === "continuous") {
    console.log("Trimming empty background pages...");
    const trim = spawnSync(
      "python3",
      [join(ROOT, "scripts/trim-brandbook-pdf.py"), OUTPUT],
      { stdio: "inherit" },
    );
    if (trim.status !== 0) {
      console.warn("PDF trim skipped");
    }
  }

  const mb = (statSync(OUTPUT).size / 1024 / 1024).toFixed(2);
  console.log(`Saved: ${OUTPUT}`);
  console.log(`Size: ${mb} MB`);

  if (startedLocally && child) {
    child.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
