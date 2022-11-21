const q = (x, a = document) => a.querySelector(x)
const qq = (x, a = document) => [ ...a.querySelectorAll(x) ];

const raw_bookmark_list = q("dl");
const raw_bookmark_groups = [ ...raw_bookmark_list.children ];
const my_groups_raw = raw_bookmark_groups.slice(-2);
const raw_links = my_groups_raw.flatMap(x => qq("a", x));

const booksmarks = raw_links.map(link => ({
  url: link.href,
  timestamp_added: link.getAttribute("add_date"),
  icon: link.getAttribute("icon"),
  title: link.textContent,
}));
