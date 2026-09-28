import seatingSpecsJson from "@/data/seating-specs.json";

export type SeatingSpec = {
  note?: string;
  rows: { label: string; value: string }[];
};

const seatingSpecs = seatingSpecsJson as Record<string, SeatingSpec>;

export type ProductCopy = {
  structured: boolean;
  description: string;
  dimensions: string;
  story: string;
};

const sectionCluster = /نوع\s*نشیمن[ \t\r\n]*توضیحات[ \t\r\n]*ابعاد/;
const storyLabel = /چرا\s*خانه\s*چوب\s*و\s*هنر\s*؟/;

/**
 * WordPress accordions were flattened on import. The tab titles survived as
 * loose text ("نوع نشیمن توضیحات ابعاد") while the seating table lived in a
 * separate block. Split the remaining copy back into those sections.
 */
function peelBrandStory(html: string) {
  const match = html.match(storyLabel);
  if (!match || match.index === undefined) return { body: html.trim(), story: "" };
  return {
    body: html.slice(0, match.index).trim(),
    story: html.slice(match.index + match[0].length).trim(),
  };
}

export function splitProductCopy(html: string): ProductCopy {
  const { body, story } = peelBrandStory(html);
  const match = body.match(sectionCluster);
  if (!match || match.index === undefined) {
    return { structured: false, description: body, dimensions: "", story };
  }

  return {
    structured: true,
    description: body.slice(0, match.index).trim(),
    dimensions: body.slice(match.index + match[0].length).trim(),
    story,
  };
}

function tableHasContent(table: string) {
  return table.replace(/<[^>]+>/g, "").replace(/&nbsp;|&#160;/gi, " ").trim().length > 0;
}

/** Drop marketing and filler paragraphs. Tables, lists, and image captions stay. */
export function stripProseParagraphs(html: string) {
  const tables: string[] = [];
  const withoutTables = html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    if (!tableHasContent(table)) return "";
    tables.push(table);
    return `%%TABLE${tables.length - 1}%%`;
  });
  const stripped = withoutTables.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, (paragraph) => (/<img\b/i.test(paragraph) ? paragraph : ""));
  return stripped
    .replace(/%%TABLE(\d+)%%/g, (_, index) => tables[Number(index)] ?? "")
    .replace(/(^|>)[\s\u00a0]*(?:نوع\s*نشیمن|توضیحات|ابعاد)[\s\u00a0]*(?=<|$)/g, "$1")
    .trim();
}

export function getSeatingSpec(slug: string): SeatingSpec | undefined {
  const spec = seatingSpecs[slug];
  if (!spec?.rows?.length) return undefined;
  return spec;
}
