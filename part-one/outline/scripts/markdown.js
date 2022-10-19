import * as Marked from "./third-party/marked/marked.js";
import DOMPurify from "./third-party/dompurify/purify.js";

const dom_parser = new DOMParser();

const parse_md = markdown => Marked.parse(markdown);
const sanitize_html = html => DOMPurify.sanitize(html);
const html_to_dom = html => dom_parser.parseFromString(html, "text/html");

/**
 * This function takes Markdown and converts it into a list of elements.
 *
 * It currently uses two third-party libraries:
 *
 *   - Marked to convert the Markdown into HTML text, and
 *   - DOMPurify to sanitize that HTML.
 *
 * It then uses the built-in DOMParser to parse the HTML. It is perhaps a bad
 * assumption that the Markdown will be all be interpreted as <body> elements,
 * but it's good enough for now. (Alternatives include using another third-party
 * library or creating an new element, assigning its `innerHTML`, and then
 * returning its children.)
 */
export default function render_md(markdown = "") {
  const dom = html_to_dom(sanitize_html(parse_md(markdown)));
  return [ ...dom.body.children ];
}
