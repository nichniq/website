// 1. zoom out to like 30% to get all of the pins on the page
// 2. paste the script into the console
// 3. once the mouseover has completed for each pin, run `pins()`
// 4. copy the output from the terminal as JSON

const q = (selector, parent) => (parent ?? document).querySelector(selector);
const qq = (selector, parent) => [ ...(parent ?? document).querySelectorAll(selector) ];

const profile_boards = () => qq("[data-test-id='pwt-grid-item']").map(board => ({
  title: q("h2", board).textContent,
  href: q("a", board).href,
})).slice(1);

const board_sections = () => qq("[data-test-id*='section-']").map(section => ({
  title: q("h2", section).textContent,
  href: q("a", section).href,
}));

const pin_info = pin => ({
  desc: /(This contains an image of: )?(.*)/.exec(q("img", pin).alt)[2],
  source_url: q("[data-test-id='pinrep-source-link'] a", pin)?.href,
  img_url: q("img", pin).src.replace("236x", "originals"),
  pin_url: q("a", pin).href,
});

const trigger_mouse_event = (type, element) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  element.dispatchEvent(event);
};

const hover_over_pins = () => {
  for (pin of qq("[data-test-id='pin']")) {
    trigger_mouse_event("mouseover", pin);
  }
};

const boards = profile_boards;
const sections = board_sections;
const pins = () => qq("[data-test-id='pin']").map(x => pin_info(x));

hover_over_pins();
