const split = (string, character) => string.split(character);
const test = (regex, string) => regex.test(string);
const match = (regex, string) => regex.exec(string);
const for_all = (array, transform) => array.map((x) => transform(x));
const trim_end = (string) => string.trimEnd();
const join = (array, character) => array.join(character);
const transform = (steps, input) => steps.reduce((x, step) => step(x), input);

const line_types = [
  // example: "- List items start with a dash and space"
  // capture: "List items start with a dash and space"
  [ "line_item", /^- (.+)$/ ],

  // example: "{{ text A full block opens and closes in one line }}"
  // capture: "text A full block opens and closes in one line"
  [ "full_block", /^{{ (.+) }}$/ ],

  // example: "{{ block"
  // capture: "block"
  [ "open_block", /^{{ (.+)(?<! }})$/ ],

  // example: "}}"
  // capture: ""
  [ "close_block", /^()}}$/ ],

  // example: "    indented content starts with four spaces"
  // capture: "indented content starts with four spaces"
  [ "indented", /^ {4}(.+)$/ ],

  // example: ""
  // capture: ""
  [ "empty_line", /^()$/ ],

  // example: "everything else is simple text"
  // capture: "everything else is simple text"
  [ "raw_text", /^(.+)$/ ],
];

function label_line(line) {
  for (const [ type, pattern ] of line_types) {
    if (test(pattern,line)) {
      const [ full_match, capture ] = match(pattern, line);
      return [ type, capture ];
    }
  }
  return [ "raw_text", line ];
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

input.value = parse(raw);
output.value = input.value;

input.addEventListener("scroll", scroll(output));
output.addEventListener("scroll", scroll(input));
