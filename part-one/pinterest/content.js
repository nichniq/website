const q = (selector, parent = document) => parent.querySelector(selector);
const qq = (selector, parent = document) => [ ...parent.querySelectorAll(selector) ];

const add_message_listener = listener => { browser.runtime.onMessage.addListener(listener) };
const send_message = message => browser.runtime.sendMessage({ from: "content_script", message });

const visit_url = url => { window.location.href = url };

const profile_href = () => q("[data-test-id='header-profile'] a").href;

const profile_boards = () => {
  const [ all_pins, ...boards ] = qq("[data-test-id='pwt-grid-item']");
  return boards.map(board => ({
    title: q("h2", board).textContent,
    href: q("a", board).href,
  }));
};

const board_sections = () => {

  const uncategorized = qq("[role='listitem']").map(x => q("a", x).href);
  const sections = qq("[data-test-id*='section-']").map(section => [
    q("h2", section).textContent,
    q("a", section).href,
  ]);
  return [
    uncategorized.length > 0 ? [ "Uncategorized", uncategorized ] : [],
    ...sections,
  ].filter(x => x.length > 0);
}

const get_

function main() {
  add_message_listener(message => {
    console.log("content script received message", message)
  });
}
