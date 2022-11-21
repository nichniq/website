const chain = (seed, ...steps) => steps.reduce((x, fn) => fn(x), seed);
const q = selector => lineage => lineage.querySelector(selector);
const children = element => [ ...element.children ];
const tail = length => array => array.slice(length * -1);
const flatten = array => array.flat(Infinity);
const map = fn => array => array.map(x => fn(x));
const qq = selector => lineage => [ ...lineage.querySelectorAll(selector) ];
const link = a => ({
  url: a.href,
  timestamp_added: a.getAttribute("add_date"),
  icon: a.getAttribute("icon"),
  title: a.textContent,
});

const bookmarks = chain(
  document, q("dl"), children, tail(2), map(qq("a")), flatten, map(link)
);
