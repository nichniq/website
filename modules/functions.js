export const array = {
  first_in_or: (match, array, value) => array.find(match) ?? value,
  for_all: (array, transform) => array.map((x) => transform(x)),
  join: (array, character) => array.join(character),
  transform: (x, steps) => steps.reduce((y, step) => step(y), x),
};

export const string = {
  extract: (string, regex) => regex.exec(string),
  split: (string, character) => string.split(character),
  test: (string, regex) => regex.test(string),
  trim_end: (string) => string.trimEnd(),
};

export const debugging = {
  breakpoint: (value) => { debugger; return value; },
};


