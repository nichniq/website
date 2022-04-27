const apply = fn => ({ to: array => array.map(x => fn(x)) });
const breakpoint = value => { debugger; return value; };
const extract = pattern => ({ from: (string) => pattern.exec(string) });
const join = array => ({ with: character => array.join(character) });
const pass = x => ({ through: steps => steps.reduce((y, step) => step(y), x) });
const search = array => ({ for: match => ({ else: value => array.find(match) ?? value }) });
const split = string => ({ on: character => string.split(character) });
const test = string => ({ for: regex => regex.test(string) });
const trimend = string => string.trimEnd();
const wrap = ([ start, end ]) => ({ around: string => `${start}${string}${end}` });

const identify = (line) => search(
  [
    [ "line_item",   /^- (.+)$/ ],          // "- Item"          -> "Item"
    [ "full_block",  /^{{ (.+) }}$/ ],      // "{{ text Text }}" -> "text Text"
    [ "open_block",  /^{{ (.+)(?<! }})$/ ], // "{{ text"         -> "text"
    [ "close_block", /^()}}$/ ],            // "}}"              -> ""
    [ "indented",    /^ {4}(.+)$/ ],        // "    indented"    -> "indented"
    [ "empty_line",  /^()$/ ],              // ""                -> ""
    [ "raw_text",    /^(.+)$/ ],            // "remaining"       -> "remaining"
  ]
).for(
  ([ type, pattern ]) => test(line).for(pattern)
).else(
  [ "no_match", /^(.*)$/ ]
);

const label = (line) => pass(line).through(
  [
    (line) => [ line, identify(line) ],
    ([ line, [ type, pattern ] ]) => [ type, extract(pattern).from(line) ],
    ([ type, [ match, capture ] ]) => [ type, capture ],
  ]
);

const format_line = ([ type, content ]) => `[ "${type}", "${content}" ],`;
const format_lines = (lines) => pass(lines).through(
  [
    (lines) => apply(format_line).to(lines),
    (lines) => join(lines).with("\n"),
    (output) => wrap([ "[ ", " ]"]).around(output)
  ]
);

export default (input) => pass(input).through(
  [
    (input) => split(input).on("\n"),
    (lines) => apply(trimend).to(lines),
    (lines) => apply(label).to(lines),
    (lines) => format_lines(lines),
  ]
);
