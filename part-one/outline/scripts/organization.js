export default function Organization (initial_collection = []) {
  const collection = new Set(
    Array.isArray(initial_collection) ? initial_collection : [intial_collection]
  );

  const registry = new WeakMap(
    [ ...collection ].map(x => [ x, window.crypto.randomUUID() ])
  );

  function incorporate(item) {
    collection.add(item);
    registry.set(item, window.crypto.randomUUID());
  }

  return {
    collection,
    registry,
    incorporate: (...items) => items.forEach(x => incorporate(x))
  }
}
