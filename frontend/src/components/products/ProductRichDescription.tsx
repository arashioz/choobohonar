type ProductRichDescriptionProps = {
  html: string;
  className?: string;
};

const allowedTags = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "h2",
  "h3",
  "h4",
  "blockquote",
]);

/**
 * Product copy is imported from WordPress and can contain paragraphs and
 * specification tables. Keep those structural tags, while dropping every
 * attribute (and all unsafe/embed tags) before using dangerouslySetInnerHTML.
 */
function sanitizeProductHtml(value: string): string {
  const withoutUnsafeBlocks = value
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|svg|math)[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|svg|math)[^>]*\/?\s*>/gi, "");

  return withoutUnsafeBlocks
    .replace(/<\/?([a-z0-9]+)(?:\s[^<>]*)?\s*\/?>/gi, (tag, name: string) => {
      const normalized = name.toLowerCase();
      if (!allowedTags.has(normalized)) return "";
      if (tag.startsWith("</")) return `</${normalized}>`;
      if (normalized === "br") return "<br>";

      // WordPress tables use these two harmless layout attributes. Everything
      // else, including style and event-handler attributes, is deliberately
      // removed.
      if (normalized === "td" || normalized === "th") {
        const attributes = ["colspan", "rowspan"]
          .map((attribute) => {
            const match = tag.match(
              new RegExp(`\\b${attribute}\\s*=\\s*[\"']?(\\d+)`, "i"),
            );
            return match ? ` ${attribute}="${match[1]}"` : "";
          })
          .join("");
        return `<${normalized}${attributes}>`;
      }
      return `<${normalized}>`;
    })
    .replace(/\r?\n/g, "<br>");
}

export default function ProductRichDescription({
  html,
  className = "",
}: ProductRichDescriptionProps) {
  if (!html.trim()) return null;
  return (
    <div
      dir="rtl"
      className={`max-w-3xl whitespace-normal text-base leading-9 text-forest/70 [&_p]:mb-5 [&_p:last-child]:mb-0 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pr-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pr-6 [&_table]:mb-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-forest/15 [&_td]:p-3 [&_th]:border [&_th]:border-forest/15 [&_th]:bg-forest/5 [&_th]:p-3 [&_th]:font-medium ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeProductHtml(html) }}
    />
  );
}
