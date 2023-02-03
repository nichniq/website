const message_to_bg = (type, payload) => browser.runtime.sendMessage([ type, payload ]);

const insert_element = () => {
  const element = document.createElement("div");

  element.style.position = "fixed";
  element.style.height = "100px";
  element.style.width = "100px";
  element.style.top = "0";
  element.style.left = "0";
  element.style.border = "1px solid black";
  element.style.background = "white";
  element.style.zIndex = "9999";

  element.addEventListener("click", event => {
    console.log("clicked element");

    message_to_bg("clicked element", { href: window.location.href }).then(
      x => { console.log("response from bg", x) }
    );
  })

  document.body.append(element);
};

document.addEventListener("selectionchange", () => {
  const selection = document.getSelection().toString();
  browser.runtime.sendMessage([ "selection", selection ]);
});

console.log("content script loaded");
