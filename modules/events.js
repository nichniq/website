/**
 * Listeners are entries containing the event type and handler. Event options,
 * such as specifying the capture phase, are not currently supported.
 *
 * ```javascript
 * listen({
 *   target: button,
 *   listeners: [
 *     [ "submit", e => console.log("first submit" e) ],
 *     [ "submit", e => console.log("second submit" e) ],
 *     [ "reset", e => console.log("reset", e) ],
 *   ]
 * });
 * ```
 */

const process_listeners = ({ target, method, listeners }) => {
  for ( const [ event_type, handler ] of listeners ) {
     method.call(target, event_type, handler);
  }

  return target;
}

export const listen = ({ target, listeners }) => process_listeners({
  target,
  method: EventTarget.prototype.addEventListener,
  listeners,
});

export const forget = ({ target, handlers }) => process_listeners({
  target,
  method: EventTarget.prototype.removeEventListener,
  listeners,
});

export const dispatch = ({ target, type, details }) => {
  target.dispatchEvent(
    new CustomEvent(type, { details: details })
  );

  return target;
}
