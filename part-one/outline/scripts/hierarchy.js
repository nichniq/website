/**
 * IN PROGRESS
 *
 * - Create group of hierarchy-related functions
 * - Create shortcut for functions that operate on designated root
 *
 * - This file could describe hierarchy and key terms
 * - Associates functions with terms, uses as explanation
 * - Maybe can interweave comments and functions
 *
 * - Include examples, proofs, test, assertions
 * - Include optimizations
 *   - e.g. for siblings, don't need to search whole tree can just find first
 * - Add memoization, caching
 *
 * - Provide low-level functions but pick good defaults
 */

const Hierarchy = {
  children: node => {
    return node.children || [];
  },

  descendants: node => {
    const children = Hierarchy.children(node);
    const grandchildren = children.flatmap(child => Hierarchy.descendants(child));
    return [ children, ...grandchildren.flat(1) ];
  },

  height: node => {
    return descendants(node).length;
  },

  parent: root => node => {
    return;
  },

  levels: root => {
    return descendants(root)(root);
  },

  siblings: root => node => {
    const p = parent(root)(node);
    const c = children(root)(p);
    return c.filter(x => x !== node);
  },

  depth: root => node => {
    return levels(root).reduce(
      (d, l, i) => (d === -1 && l.includes(node)) ? i : d, -1
    );
  },
};

Hierarchy.from = root => ({
  levels: () => Hierarchy.descendants(root),
  height: () => Hierarchy.height(root),
  parent: node => Hierarchy.parent(root)(node),
  depth: node => Hierarchy.depth(root)(node),
  siblings: node => Hierarchy.siblings(root)(node),
  generation: node => Hierarchy.generation(root)(node),
}

/**
 * https://en.wikipedia.org/wiki/Hierarchy
 *
 * - Object: one entity (e.g., a person, department or concept or element of arrangement or member of a set)
 * - System: the entire set of objects that are being arranged hierarchically (e.g., an administration)
 * - Dimension: another word for "system" from on-line analytical processing (e.g. cubes)
 * - Member: an (element or object) at any (level or rank) in a (class-system, taxonomy or dimension)
 *
 * - Terms about Positioning
 *   - Rank: the relative value, worth, complexity, power, importance, authority, level etc. of an object
 *   - Level or Tier: a set of objects with the same rank OR importance
 *   - Ordering: the arrangement of the (ranks or levels)
 *   - Hierarchy: the arrangement of a particular set of members into (ranks or levels). Multiple hierarchies are possible per (dimension taxonomy or Classification-system), in which selected levels of the dimension are omitted to flatten the structure
 *
 * - Terms about Placement
 *   - Hierarch, the apex of the hierarchy, consisting of one single orphan (object or member) in the top level of a dimension. The root of an inverted-tree structure
 *   - Member, a (member or node) in any level of a hierarchy in a dimension to which (superior and subordinate) members are attached
 *   - Orphan, a member in any level of a dimension without a parent member. Often the apex of a disconnected branch. Orphans can be grafted back into the hierarchy by creating a relationship (interaction) with a parent in the immediately superior level
 *   - Leaf, a member in any level of a dimension without subordinates in the hierarchy
 *   - Neighbour: a member adjacent to another member in the same (level or rank). Always a peer.
 *   - Superior: a higher level or an object ranked at a higher level (A parent or an ancestor)
 *   - Subordinate: a lower level or an object ranked at a lower level (A child or a descendant)
 *   - Collection: all of the objects at one level (i.e. Peers)
 *   - Peer: an object with the same rank (and therefore at the same level)
 *   - Interaction: the relationship between an object and its direct superior or subordinate (i.e. a superior/inferior pair)
 *        - a direct interaction occurs when one object is on a level exactly one higher or one lower than the other (i.e., on a tree, the two objects have a line between them)
 *   - Distance: the minimum number of connections between two objects, i.e., one less than the number of objects that need to be "crossed" to trace a path from one object to another
 *   - Span: a qualitative description of the width of a level when diagrammed, i.e., the number of subordinates an object has
 *
 * - Terms about Nature
 *   - Attribute: a heritable characteristic of (members and their subordinates) in a level (e.g. hair-colour)
 *   - Attribute-value: the specific value of a heritable characteristic (e.g. Auburn)
