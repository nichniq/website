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

function parseLine(line) {
  for (const [ type, pattern ] of line_types) {
    if (pattern.test(line)) {
      const [ full_match, capture ] = pattern.exec(line);
      return [ type, capture ];
    }
  }
  return [ "raw_text", line ];
}

function parse(raw) {
  return raw.split("\n").map((line) => parseLine(line.trimEnd()));
}

import sample from "/dsl/sample/00-raw.js";

const input = document.getElementById("input");
const output = document.getElementById("output");

input.value = sample;
output.value = `[ ${parse(sample).map(([ type, content ]) => `[ "${type}", "${content}" ]`).join("\n, ")} ]`;

const scroll = (mirror) => ({ target: source }) => {
  if (mirror.scrollTop !== source.scrollTop) {
    mirror.scroll({ top: source.scrollTop });
  }
}

input.addEventListener("scroll", scroll(output));
output.addEventListener("scroll", scroll(input));
