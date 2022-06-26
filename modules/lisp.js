export const maybe = (truthy, array) => truthy ? array : [];

export const first = (arrays) => arrays.find((x) => x.length > 0) || [];

export const unzip = (entries) => {
  const map = Object.fromEntries(entries);

  return [ Object.keys(map), Object.values(map) ];
};
