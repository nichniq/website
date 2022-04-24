const split = (string, character) => string.split(character);
const test = (regex, string) => regex.test(string);
const match = (regex, string) => regex.exec(string);
const for_all = (array, transform) => array.map((x) => transform(x));
const trim_end = (string) => string.trimEnd();
const join = (array, character) => array.join(character);
const transform = (steps, input) => steps.reduce((x, step) => step(x), input);
const first = (array, provided, test) => array.find(test) || provided;

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
  const [ type, pattern ] = first(
    line_types,
    [ "no_match", /^(.*)$/ ],
    ([ type, regex ]) => test(regex, line)
  );
  const [ full_match, capture ] = match(pattern, line);
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
