import { extract, split, test, trim_end } from "/modules/string.js";
import { first_or, for_all, join, transform } from "/modules/array.js";

const line_types = [
  [ "line_item",   /^- (.+)$/ ],          // "- List item"      -> "List item"
  [ "full_block",  /^{{ (.+) }}$/ ],      // "{{ text Block }}" -> "text Block"
  [ "open_block",  /^{{ (.+)(?<! }})$/ ], // "{{ text"          -> "text"
  [ "close_block", /^()}}$/ ],            // "}}"               -> ""
  [ "indented",    /^ {4}(.+)$/ ],        // "    indented"     -> "indented"
  [ "empty_line",  /^()$/ ],              // ""                 -> ""
  [ "raw_text",    /^(.+)$/ ],            // "remaining"        -> "remaining"
];

function label_line(line) {
  const [ type, pattern ] = first_or(
    line_types,
    [ "no_match", /^(.*)$/ ],
    ([ type, pattern ]) => test(line, pattern)
  );
  const [ full_match, capture ] = extract(line, pattern);
  return [ type, capture ];
}

const format_labeled_lines = (lines) => `[ ${join(
  for_all(lines,
    ([ type, content ]) => `[ "${type}", "${content}" ]`
  ), "\n",
)} ]`;

const parse = (raw) => transform([
  (raw) => split(raw, "\n"),
  (raw_lines) => for_all(raw_lines, trim_end),
  (trimmed_lines) => for_all(trimmed_lines, label_line),
  (labeled_lines) => format_labeled_lines(labeled_lines),
 ], raw);

const scroll = (mirror) => ({ target: source }) => {
  if (mirror.scrollTop !== source.scrollTop) {
    mirror.scroll({ top: source.scrollTop });
  }
}

import raw from "/dsl/sample/00-raw.js";

const input = document.getElementById("input");
const output = document.getElementById("output");

input.addEventListener(
  "change",
  ({ target }) => { output.value = parse(target.value) }
);

input.addEventListener("scroll", scroll(output));
output.addEventListener("scroll", scroll(input));

input.value = parse(raw);
