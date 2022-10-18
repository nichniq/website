/**
 * This function take a tree, mutates it, and returns an extended access API.
 *
 * A tree is represented by its root node. A tree node is an object with the
 * property `children` which is an array of tree nodes. Terminating nodes have
 * no children. Nodes may have additional properties.
 *
 * This function mutates each node by adding (or overriding) `id` and
 * `parent_id` (if provided).
 *
 * It returns a number of related ways to access the data:
 *
 * - `origin` : the root node
 * - `registry` : an object registry that maps ID to node object
 * - `generations` : a list of each level's nodes in the tree
 *
 * It is called a "descendency" as a generalization of the "tree" metaphor.
 * Other names for this structure/pattern include hierarchies, pyramids, rivers,
 * composition.
 */
export default function descendency(origin) {
  const registry = {};
  const generations = [];

  function process_node(node, depth, parent_id) {
    // 1. add a unique ID to the node
    node.id = window.crypto.randomUUID();

    // 2. add the parent's ID, if provided
    if (parent_id != null) {
      node.parent_id = parent_id;
    }

    // 3. register the node with its ID
    registry[node.id] = node;

    // 4. if we haven't started recording nodes for the generation, then start
    if (generations.length === depth) {
      generations[depth] = [];
    }

    // 5. add the node to its generation from the root
    generations[depth].push(node);

    // 6. for each of the node's children, repeat this process
    for (const child of node.children || []) {
      process_node(child, depth + 1, node.id);
    }

    // 7. return the mutated node (and any mutated children)
    return node;
  }

  process_node(origin, 0);

  return { origin, registry, generations };
}
