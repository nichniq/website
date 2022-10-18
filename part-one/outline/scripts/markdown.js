import * as Marked from "./third-party/marked/marked.js";
import DOMPurify from "./third-party/dompurify/purify.js";

const dom_parser = new DOMParser();

const parse_md = markdown => Marked.parse(markdown);
const sanitize_html = html => DOMPurify.sanitize(html);
const html_to_dom = html => dom_parser.parseFromString(html, "text/html");

export default function render_md(markdown = "") {
  const dom = html_to_dom(sanitize_html(parse_md(markdown)));
  return [ ...dom.children ];
}
