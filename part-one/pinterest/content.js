/* DEFINITIONS */

// DOM searching

const q = (selector, parent) => (parent ?? document).querySelector(selector);
const qq = (selector, parent) => [ ...(parent ?? document).querySelectorAll(selector) ];

// navigation

const visit_url = url => { window.location.href = url };

// events

const trigger_mouse_event = (type, element) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  element.dispatchEvent(event);
};

// pinterest

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

const pin_data = pin => new Promise((resolve, reject) => {
  const img = q("img", pin);

  trigger_mouse_event("mouseover", img);

  const attempt = (delay_ms, remaining_attempts) => setTimeout(
    function() {
      const source = q("[data-test-id='pinrep-source-link'] a", pin);

      if (remaining_attempts === 0) {
        reject("Could not find source link");
      } else if (source == null) {
        attempt(delay_ms, max_tries - 1);
      } else {
        resolve([
          pin.dataset.testPinId,
          {
            desc: /(This contains an image of: )?(.*)/.exec(img.alt)[2],
            source_url: source.href,
            img_url: img.src.replace("236x", "originals"),
          }
        ])
      }
    },
    delay_ms,
  );

  attempt(100, 10);
});

// script messaging

const send_message = (type, payload) => {
  browser.runtime.sendMessage([ type, payload ]);
  console.log("sent", type, payload);
}

/* EXECUTION */

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

send_message("content_script_loaded", { last_loaded: Date.now() });

// pin_data(qq("[data-test-id='pin']")[0]).then(console.log);
