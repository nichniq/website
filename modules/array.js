export const first_in_or = (match, array, value) => array.find(match) ?? value;
export const for_all = (array, transform) => array.map((x) => transform(x));
export const join = (array, character) => array.join(character);
export const transform = (x, steps) => steps.reduce((y, step) => step(y), x);
