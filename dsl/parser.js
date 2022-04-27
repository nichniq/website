const apply = fn => ({ to: array => array.map(x => fn(x)) });
const breakpoint = value => { debugger; return value; };
const extract = pattern => ({ from: (string) => pattern.exec(string) });
const join = array => ({ with: character => array.join(character) });
const search = array => ({ for: match => ({ else: value => array.find(match) ?? value }) });
const split = string => ({ on: character => string.split(character) });
const test = string => ({ for: regex => regex.test(string) });
const transform = seed => ({ via: steps => steps.reduce((x, step) => step(x), seed) });
const trimend = string => string.trimEnd();
const wrap = ([ start, end ]) => ({ around: string => `${start}${string}${end}` });

const identify = line => search(
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

const label = line => transform(line).via(
  [
    (line) => [ line, identify(line) ],
    ([ line, [ type, pattern ] ]) => [ type, extract(pattern).from(line) ],
    ([ type, [ match, capture ] ]) => [ type, capture ],
  ]
);

function partition(lines) {
  let in_block = false;
  let queue = [];
  const partitions = [];

  for (const line of lines) {
    const [ type, content ] = line;

    if (type === "empty_line" && in_block === false) {
      if (queue.length > 0) {
        partitions.push(queue);
        queue = [];
      }
    } else if (type === "full_block") {
      partitions.push([ line ]);
    } else {
      if (type === "open_block") {
        in_block = true;
      }

      if (type === "close_block") {
        in_block = false;
      }

      queue.push(line);
    }
  }

  if (queue.length > 0) {
    partitions.push(queue);
  }

  return partitions;
}

const format_partition = partition => wrap([ "[\n", "\n]" ]).around(
  join(
    apply(line => `\t${JSON.stringify(line)}`).to(partition)
  ).with(",\n")
);

const parse = input => transform(input).via(
  [
    input => split(input).on("\n"),
    lines => apply(trimend).to(lines),
    trimmed_lines => apply(label).to(trimmed_lines),
    labeled_lines => partition(labeled_lines),
    partitions => apply(format_partition).to(partitions),
    text => wrap([ "[ ", " ]" ]).around(text),
  ]
);

export default parse;
