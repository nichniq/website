const breakpoint = value => { debugger; return value; };
const extract_from_ = pattern => string => pattern.exec(string);
const map_with_ = array => fn => array.map((x) => fn(x));
const place_between_ = character => array => array.join(character);
const search_for_else_ = array => match => value => array.find(match) ?? value;
const split_on_ = string => character => string.split(character);
const test_for_ = string => regex => regex.test(string);
const pass_through_ = x => steps => steps.reduce((y, step) => step(y), x);
const trimend = string => string.trimEnd();
const wrap_around_ = ([ start, end ]) => string => `${start}${string}${end}`;

const type_ = line => search_for_else_(
  [
    [ "line_item",   /^- (.+)$/ ],          // "- Item"          -> "Item"
    [ "full_block",  /^{{ (.+) }}$/ ],      // "{{ text Text }}" -> "text Text"
    [ "open_block",  /^{{ (.+)(?<! }})$/ ], // "{{ text"         -> "text"
    [ "close_block", /^()}}$/ ],            // "}}"              -> ""
    [ "indented",    /^ {4}(.+)$/ ],        // "    indented"    -> "indented"
    [ "empty_line",  /^()$/ ],              // ""                -> ""
    [ "raw_text",    /^(.+)$/ ],            // "remaining"       -> "remaining"
  ]
)(
  ([ type, pattern ]) => test_for_(line)(pattern)
)(
  [ "no_match", /^(.*)$/ ]
);

const label_ = (line) => pass_through_(
  line
)(
  [
    (line)                         => [ line, type_(line) ],
    ([ line, [ type, pattern ] ])  => [ type, extract_from_(pattern)(line) ],
    ([ type, [ match, capture ] ]) => [ type, capture ],
  ]
);

const format_ = (lines) => wrap_around_(
  [ "[", "]" ]
)(
  place_between_(
    "\n"
  )(
    map_with_(lines)(([ type, content ]) => `[ "${type}", "${content}" ],`)
  )
);

const parse = (raw) => pass_through_(
  raw
)(
  [
    raw             => split_on_(raw)("\n"),
    (lines)     => map_with_(lines)(trimend),
    (lines) => map_with_(lines)(label_),
    (lines) => format_(lines),
  ]
);

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
