export default function hierarchy(root) {
  const parents = new Map();

  function injest_node(node, parent) {
    parents.set(node, parent);

    for (const child of node.children || []) {
      injest_node(child, node);
    }
  }

  function recursive_ancestors(ancestors, node) {
    return node == null
      ? ancestors
      : recursive_ancestors([ ...ancestors, node ], parents.get(node));
  }

  function recursive_descendants(descendants, children) {
    const next_gen = children.filter(c => c.children).map(c => c.children);
    return next_gen.length === 0
      ? descendants
      : recursive_descendants([ ...descendants, next_gen ], next_gen.flat());
  }

  injest_node(root);

  return {
    get root() { return root },
    get parents() { return parents },

    ancestors: node => recursive_ancestors([], parents.get(node)),
    descendants: node => recursive_descendants(
      [ node.children || [] ],
      node.children || []
    ),
  };
}
