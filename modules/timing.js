export const throttle = (fn, ms_rate) => {
  let lastCalled = 0;

  return (...args) => {
    const now = Date.now();

    if (now - lastCalled < ms_rate) { return }

    lastCalled = now;
    return fn(...args);
  }
}
