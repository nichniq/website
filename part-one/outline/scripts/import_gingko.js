import descendency from "./descendency.js";

/**
 * This function creates a descendency out of a Gingko tree.
 *
 * The Gingko tree should be accessed via the provided filepath. It should be an
 * array of top-level nodes that each have the `content` and `children`
 * properties (and whose children share the same shape).
 *
 * The data structure is then mutated into a descendency for extended access.
 */
export default async function import_gingko(filepath) {
  const fetch_json = path => fetch(path).then(response => response.json());
  const children = await fetch_json(filepath);
  return descendency({ children });
}
