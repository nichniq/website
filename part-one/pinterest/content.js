/* DEFINITIONS */

// DOM searching
const q = (selector, parent) => (parent ?? document).querySelector(selector);
const qq = (selector, parent) => [ ...(parent ?? document).querySelectorAll(selector) ];

// timing
const SECS = 1000;
// const wait = ms => new Promise((res, rej) => { setTimeout(res, ms) });
// const wait_for = (selector, max_ms) => new Promise((res, rej) => {
//   const deadline = setTimeout(() => rej(`Didn't find "${selector}" after ${max_ms}ms`), max_ms);
//   const test = () => q(selector) == null;
//   const attempt = () => {
//     const first_result = q(selector);

//     if (first_result == null) {
//       setTimeout(attempt, Math.floor(max_ms / 10));
//     }
//     return first_result == null ? attemp()
//     const exists = () =>q(selector) == null ? res
//   const attempt = () => q(selector) ? res(q(selector)) : wait(max_ms / 10).then(attempt);
//   return attempt();
// });

// wait(1000ms) => res(timer finished at timestamp)
// wait(1000ms).for(selector) => res({ selector, returned: element: at: timestamp }) or fail({ selector, missing_at: timestamp })

// usage: timer(1000)
//   - rejects in 1000, never resolves
wait(1000*MS);

// usage: time limit: 1000, .for() promise takes precedence, retry every ??? ms
wait(1000*MS).for(id("id"));
wait(1000*MS).for(clazz("class"));
wait(1000*MS).for(attribute("checked"));
wait(1000*MS).for(attribute("checked").of("value"));

wait(1000*MS).for(scroll("bottom"));

wait(1000*MS).for(async_fn);
wait(1000*MS).for(promise);

wait(1000*MS).for(selector(".class"));

id("id"); // promise that returns id check
clazz("class"); // promise that returns membership to class
attribute("attribute"); // promise that returns monitoring of attribute


// usage: wait(1000).for_selector(selector)
//   - timer rejects after 1000 or resolves with selector

//   - a promise that rejects in 1000ms or resolves with [] of results

//   - arbitrarity
//        - resolves in 1000ms
//        - never rejects
// usage: wait(1000).for((predicate, yay, nay) => predicate ? truth : falsehood )

const wait = ms_countdown => {

const every = milliseconds => { /* do */ };
const attempt = fn => { /* predicate ? resolve(truthy) : reject(falsy) }

  new Promise((resolve, reject) => {

})
  // 1. initially, create a timer to resolve with the resolution timestamp
  const initial_timer_id = setTimeout(() => resolve(Date.now()), ms_countdown);

  const resolution = new Promise((resolve, reject) => {
    const initial_timer_id = setTimeout(() => resolve(Date.now()), ms_countdown);
  });

  resolution.for = selector => {
    const find = document.querySelector(selector);
  };

  return resolution;
};

  const timer = new Promise((resolve, reject) => {
  const timer_id = setTimeout(() => resolve(Date.now()), ms_countdown);
  return {
    for
  }
  timer.for = {};
  return timer;
}

// page events

const trigger_mouse_event = (type, element) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  element.dispatchEvent(event);
};



const page_ready = () => new Promise((resolve, rej) => {
  const reject = message => () => rej(message);
  wait()
  const ready = () => document.readyState === 'complete';
  const attempt = () => setTimeout(() => ready() ? resolve() : attempt(), 500);
  ready() ? resolve() : attempt();

  wait( 5*SECS ).then( reject("Page still loading") );
});

const scroll_to_bottom = () => new Promise((resolve, reject) => {
  const scroll = () => window.scrollTo(0, document.body.scrollHeight);
  const at_bottom = () => window.scrollY + window.innerHeight >= document.body.scrollHeight;
  const attempt = () => {
    scroll();
    page_ready().then(() => at_bottom() ? resolve() : attempt());
  };
  attempt();
  setTimeout(() => reject("Can't reach bottom"), 10000);
});

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
        attempt(delay_ms, remaining_attempts - 1);
      } else {
        resolve([
          pin.dataset.testPinId,
          {
            desc: /(This contains an image of: )?(.*)/.exec(img.alt)[2],
            source_url: source.href,
            img_url: img.src.replace("236x", "originals"),
          },
        ])
      }
    },
    delay_ms,
  );

  attempt(100, 10);
});

// actions

const click_profile =

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
