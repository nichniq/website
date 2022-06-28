export const maybe = (truthy, array) => truthy ? array : [];

export const first = (arrays) => arrays.find((x) => x.length > 0) || [];

export const unzip = (entries) => {
  const map = Object.fromEntries(entries);

  return [ Object.keys(map), Object.values(map) ];
};

export const partition = (xs, predicates) => {
  const groups = predicates.map(x => []);

  for ( const x of xs ) {
    predicates.forEach((predicate, index) => {
      if ( predicate(x) ) {
        groups[index].push(x);
      }
    });
  }

  return groups;
};

export const group = (xs, transform) => {
  const groupings = {};

  for ( const x of xs ) {
    const transformation = transform(x);

    if ( transformation in groupings ) {
      groupings[transformation].push(x);
    } else {
      groupings[transformation] = [x];
    }
  }

  return groupings;
}
