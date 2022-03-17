export const text = (content) => [ document.createTextNode(content) ];

export const element = (tag, content = [], attributes = {}) => {
    const element = document.createElement(tag);

    for ( const child of content ) {
        element.appendChild(child);
    }

    for ( const [ name, value ] of Object.entries(attributes) ) {
        element.setAttribute(name, value);
    }

    return [ element ];
};
