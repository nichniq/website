export const element = (tag, content = [], attributes = {}) => {
    const element = document.createElement(tag);

    for ( const child of [ content ].flat(Infinity) ) {
        if (child instanceof Node) {
            element.appendChild(child);
        } else if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(document.createTextNode(JSON.stringify(child)));
        }
    }

    for ( const [ name, value ] of Object.entries(attributes) ) {
        element.setAttribute(name, value);
    }

    return [ element ];
};

// groupings from https://package.elm-lang.org/packages/elm/html/latest/Html

const groupings = {
  headers: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],

  grouping: [
    "div",
    "p",
    "hr",
    "pre",
    "blockquote",
  ],

  text: [
    "span",
    "a",
    "code",
    "em",
    "strong",
    "i",
    "b",
    "u",
    "sub",
    "sup",
    "br",
  ],

  lists: [
    "ol",
    "ul",
    "li",
    "dl",
    "dt",
    "dd",
  ],

  embedded: [
    "img",
    "iframe",
    "canvas",
    "math",
    "embed",
    "object",
    "param",
    "ins",
    "del",
  ],

  inputs: [
    "form",
    "input",
    "textarea",
    "button",
    "select",
    "option",
    "fieldset",
    "legend",
    "label",
    "datalist",
    "optgroup",
    "output",
    "progress",
    "meter",
  ],

  sections: [
    "section",
    "nav",
    "article",
    "aside",
    "header",
    "footer",
    "address",
    "main",
  ],

  figures: [
    "figure",
    "figcaption",
    "table",
    "caption",
    "colgroup",
    "col",
    "tbody",
    "thead",
    "tfoot",
    "tr",
    "td",
    "th",
  ],

  av: [
    "audio",
    "video",
    "source",
    "track",
  ],

  textual: [
    "small",
    "cite",
    "dfn",
    "abbr",
    "time",
    "var",
    "samp",
    "kbd",
    "s",
    "q",
    "mark",
    "ruby",
    "rt",
    "rp",
    "bdi",
    "bdo",
    "wbr",
  ],

  interactive: [
    "details",
    "summary",
    "menuitem",
    "menu",
  ],
};

export const tags = Object.fromEntries(
    Object.values(groupings).flat().map(
        (tag) => [ tag, (content, attrs) => element(tag, content, attrs) ]
    )
);
