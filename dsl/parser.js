const breakpoint = (value) => { debugger; return value; };
const extract_from_ = (pattern, string) => pattern.exec(string);
const apply_to_ = (fn, array) => array.map((x) => fn(x));
const join_with_ = (array, character) => array.join(character);
const search_for_else_ = (array, match, value) => array.find(match) ?? value;
const split_on_ = (string, character) => string.split(character);
const test_for_ = (string, regex) => regex.test(string);
const pass_through_ = (x, steps) => steps.reduce((y, step) => step(y), x);
const trimend_ = (string) => string.trimEnd();
const wrap_around_ = ([ start, end ], string) => `${start}${string}${end}`;

const type_ = (line) => search_for_else_(
  [
    [ "line_item",   /^- (.+)$/ ],          // "- Item"          -> "Item"
    [ "full_block",  /^{{ (.+) }}$/ ],      // "{{ text Text }}" -> "text Text"
    [ "open_block",  /^{{ (.+)(?<! }})$/ ], // "{{ text"         -> "text"
    [ "close_block", /^()}}$/ ],            // "}}"              -> ""
    [ "indented",    /^ {4}(.+)$/ ],        // "    indented"    -> "indented"
    [ "empty_line",  /^()$/ ],              // ""                -> ""
    [ "raw_text",    /^(.+)$/ ],            // "remaining"       -> "remaining"
  ],
  ([ type, pattern ]) => test_for_(line, pattern),
  [ "no_match", /^(.*)$/ ],
);

const label_ = (line) => pass_through_(line,
  [
    (line)                         => [ line, type_(line) ],
    ([ line, [ type, pattern ] ])  => [ type, extract_from_(pattern, line) ],
    ([ type, [ match, capture ] ]) => [ type, capture ],
  ]
);

const format_ = (lines) => pass_through_(lines,
  [
    (lines) => apply_to_(
      ([ type, content ]) => `[ "${type}", "${content}" ],`,
      lines
    ),
    (lines) => join_with_(lines, "\n"),
    (output) => wrap_around_([ "[", "]" ], output),
  ]
);

export default (input) => pass_through_(input,
  [
    (input)   => split_on_(input, "\n"),
    (lines) => apply_to_(trimend_, lines),
    (lines) => apply_to_(label_, lines),
    (lines) => format_(lines),
  ]
);
