const names = transform(list).each(x => x.name);
const [ names, ids ] = transform(list).many([ x => x.name, x => x.id ]);
const total_edges = transform(list).into(0, x => x.edges.length);
const { ids } = transform(list).registry({ name: x => x.names });

from(list).reduce((accumulator, x) => accumulator + x).to(initial);
from(list).add(x => x.value).to(0);
from(list).append(x => x.name).to([]);
from(list).assign(x => ({ [x.key]: x.value })).to({})

/**
 * can I create "partial application" chain
 * e.g. .() produces a list where each of the things is added, but it also has
 *      methods on it to further transform the list
 */

watch(filename).on(event).do(handler);
watch(filename).events([ [ event, handler ] ]);
