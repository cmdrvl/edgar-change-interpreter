import he from "he";
const { decode } = he;

const BLOCK_TAGS = [
  "p",
  "div",
  "section",
  "article",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "td",
  "th",
  "li",
  "ul",
  "ol",
];

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

export const normalizeHtmlToText = (html: string) => {
  let output = html;

  output = output.replace(/<script[\s\S]*?<\/script>/gi, " ");
  output = output.replace(/<style[\s\S]*?<\/style>/gi, " ");
  output = output.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  output = output.replace(/<br\s*\/?\s*>/gi, "\n");

  for (const tag of HEADING_TAGS) {
    const open = new RegExp(`<${tag}[^>]*>`, "gi");
    const close = new RegExp(`</${tag}>`, "gi");
    output = output.replace(open, "\n\n");
    output = output.replace(close, "\n\n");
  }

  for (const tag of BLOCK_TAGS) {
    const open = new RegExp(`<${tag}[^>]*>`, "gi");
    const close = new RegExp(`</${tag}>`, "gi");
    output = output.replace(open, "\n");
    output = output.replace(close, "\n");
  }

  output = output.replace(/<[^>]+>/g, " ");
  output = decode(output);

  output = output.replace(/\r\n/g, "\n");
  output = output.replace(/[ \t]+/g, " ");
  output = output.replace(/\n\s+/g, "\n");
  output = output.replace(/\n{3,}/g, "\n\n");

  output = output.replace(/(\bItem\s+\d+[A-Z]?\b\.?)/gi, "\n$1");

  return output.trim();
};
