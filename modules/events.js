/**
 * Listeners are entries containing the event type and handler. Event options,
 * such as specifying the capture phase, are not currently supported.
 *
 * ```javascript
 * const button = document.getElementById("btn");
 * update(button).handle(
 *     [ "submit", e => console.log("first submit" e) ],
 *     [ "submit", e => console.log("second submit" e) ],
 *     [ "reset", e => console.log("reset", e) ],
 * );
 * ```
 */

export const update = target => ({
  handle: (...listeners) => {
    for (const [ type, handler ] of listeners) {
      target.addEventListener(type, handler);
    }

    return target;
  },

  ignore: (...listeners) => {
    for (const [ type, handler ] of listeners) {
      target.removeEventListener(type, handler);
    }

    return target;
  },
});

export const dispatch = event => ({
  from: target => ({
    with: details => {
      target.dispatchEvent( new CustomEvent( event, { details } ) );
      return target;
    },
  }),
});
