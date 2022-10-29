export default function descendency(origin) {
  const registry = new Map(); // { node -> ID }
  const ids = {}; // { ID -> node }
  const ancestors = {}; // { ID -> parent chain } - [0] parent, [1] is grand-pt
  const descendants = {}; // { ID => child levels } - [0] children, [1] grand-cn

  function process_node(node, parent_chain) {
    const id = window.crypto.randomUUID();

    for (const child of node.children || []) {
      process_node(child, [ id, ...parent_chain ]);
    }

    registry.set(node, id);
    ids[id] = node;
    ancestors[id] = parent_chain;

    if (descendants[id] == null) {
      descendants[id] = [ [] ];
    }

    parent_chain.forEach((parent_id, depth) => {
      if (descendants[parent_id] == null) {
        descendants[parent_id] = [];
      }

      if (descendants[parent_id][depth] == null) {
        descendants[parent_id][depth] = [];
      }

      descendants[parent_id][depth].push(id);
    });
  }

  process_node(origin, []);

  return {
    origin,
    registry,
    ids,
    ancestors,
    descendants,
    generations: descendants[registry.get(origin)],
    lineage: id => [
      ...ancestors[id].slice().reverse(),
      id,
      ...descendants[id].map(x => x[0] || []).flat()
    ],
  };
}








