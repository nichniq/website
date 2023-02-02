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

  element.addEventListener("click", event => {
    console.log("clicked element");
    message_to_bg("clicked element").then(console.log).catch(console.error);
  })

  document.body.append(element);
};

insert_element();

