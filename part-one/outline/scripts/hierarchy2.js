export default function hierarchy(root) {
  const ids = new Map();
  const nodes = {};
  const parent_ids = {};
  const children_ids = {};

  function injest_node(node, parent_id) {
    const id = window.crypto.randomUUID();

    ids.set(node, id);
    nodes[id] = node;

    parent_ids[id] = parent_id;

    if (node.children == null) {
      children_ids[id] = [];
    } else {
      for (const child of node.children || []) {
        injest_node(child, id);
        children_ids[id] = node.children.map(child => ids.get(child));
      }
    }
  }

  function recursive_ancestors(output, id) {
    return id == null
      ? output
      : recursive_ancestors([ ...output, id ], parent_ids[id]);
  }

  function recursive_descendants(output, children = []) {
    const next_gen = children.map(id => children_ids[id]).filter(x => x.length > 1);
    return next_gen.length === 0
      ? output
      : recursive_descendants([ ...output, next_gen ], next_gen.flat());
  }

  injest_node(root);

  return {
    get root() { return root },
    get ids() { return ids },
    get nodes() { return nodes },
    get parent_ids() { return parent_ids },
    get children_ids() { return children_ids },

    id: node => ids.get(node),
    node: id => nodes[id],
    parent: id => parent_ids[id],
    children: id => children_ids[id],

    ancestors: id => recursive_ancestors([], parent_ids[id]),
    descendants: id => recursive_descendants(
      [ children_ids[id] || [] ],
      children_ids[id]
    ),
  };
}
