import * as functions from "/modules/functions.js";

const {
  string: { extract, split, test, trim_end },
  array: { first_in_or, for_all, join, transform }
} = functions;

const line_type = (line) => first_in_or(
  ([ type, pattern ]) => test(line, pattern),
  [
    [ "line_item",   /^- (.+)$/ ],          // "- Item"          -> "Item"
    [ "full_block",  /^{{ (.+) }}$/ ],      // "{{ text Text }}" -> "text Text"
    [ "open_block",  /^{{ (.+)(?<! }})$/ ], // "{{ text"         -> "text"
    [ "close_block", /^()}}$/ ],            // "}}"              -> ""
    [ "indented",    /^ {4}(.+)$/ ],        // "    indented"    -> "indented"
    [ "empty_line",  /^()$/ ],              // ""                -> ""
    [ "raw_text",    /^(.+)$/ ],            // "remaining"       -> "remaining"
  ],
  [ "no_match", /^(.*)$/ ],
);

const label_line = (line) => transform(line, [
  (line) => [ line, line_type(line) ],
  ([ line, [ type, pattern ] ]) => [ type, extract(line, pattern) ],
  ([ type, [ full_match, capture ] ]) => [ type, capture ],
]);

const format_labeled_lines = (lines) => `[ ${join(
  for_all(lines,
    ([ type, content ]) => `[ "${type}", "${content}" ]`
  ), "\n",
)} ]`;

const parse = (raw) => transform(raw, [
  (raw) => split(raw, "\n"),
  (raw_lines) => for_all(raw_lines, trim_end),
  (trimmed_lines) => for_all(trimmed_lines, label_line),
  (labeled_lines) => format_labeled_lines(labeled_lines),
]);

const scroll = (mirror) => ({ target: source }) => {
  if (mirror.scrollTop !== source.scrollTop) {
    mirror.scroll({ top: source.scrollTop });
  }
}

import raw from "/dsl/sample/00-raw.js";

const input = document.getElementById("input");
const output = document.getElementById("output");

const populate = (textarea, value) => { textarea.value = value; };

input.addEventListener(
  "input",
  ({ target }) => { output.value = parse(target.value); }
);

input.addEventListener("scroll", scroll(output));
output.addEventListener("scroll", scroll(input));

populate(input, raw);
populate(output, parse(raw));
