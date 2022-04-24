export const first_or = (array, value, test) => array.find(test) ?? value;
export const for_all = (array, transform) => array.map((x) => transform(x));
export const join = (array, character) => array.join(character);
export const transform = (steps, x) => steps.reduce((y, step) => step(y), x);
