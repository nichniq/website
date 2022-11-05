/* DEFINITIONS */

// DOM searching

const q = (selector, parent = document) => parent.querySelector(selector);
const qq = (selector, parent = document) => [ ...parent.querySelectorAll(selector) ];

// navigation

const visit_url = url => { window.location.href = url };

// Pinterest data

const profile_url = () => q("[data-test-id='header-profile'] a").href;
const profile_boards = () => qq("[data-test-id='pwt-grid-item']").map(board => ({
  title: q("h2", board).textContent,
  href: q("a", board).href,
})).slice(1);
const board_sections = () => qq("[data-test-id*='section-']").map(section => [
  q("h2", section).textContent,
  q("a", section).href,
]);
const pin_urls = () => qq("[role='listitem']").map(pin => q("a", pin).href);
const pin_data = () => ({
  title: q("h1").textContent,
  img_url: q("[data-test-id='closeup-image'] img").src,
  link: q(".actionButton a").href,
});

// script messaging

const send_message = (type, payload) => {
  browser.runtime.sendMessage([ type, payload ]);
  console.log("sent", type, payload);
}

/* EXECUTION */

send_message("content_script_loaded", { last_loaded: Date.now() });

browser.runtime.onMessage.addListener(([ type, payload ], sender, sendResponse) => {
  console.log(`client received: ${type}`, payload);

  switch (type) {
    case "log_from_bg":
      console.log(type, payload);

      break;
    default:
      console.log("unknown event", type);

      break;
  }
});
