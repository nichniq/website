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
