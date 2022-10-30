console.time("map vs obj");
console.timeLog("map vs obj");

const range = [ ...Array(10000) ].map((x, index) => index.toString());
console.timeLog("map vs obj");

const obj = {};
console.timeLog("map vs obj");

const map = new Map();
console.timeLog("map vs obj");

for (const x of range) {
  obj[x] = x;
}
console.timeLog("map vs obj");

for (const x of range) {
  map.set(x, x);
}
console.timeLog("map vs obj");

for (const x of range) {
  obj[x];
}
console.timeLog("map vs obj");

for (const x of range) {
  map.get(x);
}
console.timeLog("map vs obj");

console.timeEnd("map vs obj");

// Firefox (105.0.3) on my 2014 Mac (10.13.6, 1.4 GHz Intel Core i5)
// tweaked code a bit between tests, run in console on different sites
// results show objs are quicker than maps in my current env

// start timer     - 13:49:43.569 - 0ms   - 0ms
// populate range  - 13:49:43.585 - 16ms  - 16ms
// create object   - 13:49:43.585 - 17ms  - 1ms
// create map      - 13:49:43.586 - 17ms  - 0ms
// populate object - 13:49:43.613 - 45ms  - 28ms
// populate map    - 13:49:43.656 - 87ms  - 42ms
// access object   - 13:49:43.673 - 105ms - 18ms
// access map      - 13:49:43.703 - 135ms - 30ms
// end timer       - 13:49:43.703 - 135ms - 0ms

// start timer     - 14:04:07.419 - 1ms   - 1ms
// populate range  - 14:04:07.447 - 28ms  - 27ms
// create object   - 14:04:07.447 - 28ms  - 0ms
// create map      - 14:04:07.447 - 29ms  - 1ms
// populate object - 14:04:07.476 - 57ms  - 28ms
// populate map    - 14:04:07.539 - 120ms - 63ms
// access object   - 14:04:07.560 - 141ms - 21ms
// access map      - 14:04:07.600 - 181ms - 40ms
// end timer       - 14:04:07.600 - 181ms - 0ms

// start timer     - 14:09:25.886 - 1ms   - 1ms
// populate range  - 14:09:25.903 - 18ms  - 17ms
// create object   - 14:09:25.904 - 18ms  - 0ms
// create map      - 14:09:25.904 - 19ms  - 1ms
// populate object - 14:09:25.931 - 45ms  - 26ms
// populate map    - 14:09:25.969 - 83ms  - 38ms
// access object   - 14:09:25.986 - 100ms - 17ms
// access map      - 14:09:26.016 - 130ms - 30ms
// end timer       - 14:09:26.016 - 130ms - 0ms

// start timer     - 14:12:22.607 - 1ms   - 1ms
// populate range  - 14:12:22.636 - 30ms  - 29ms
// create object   - 14:12:22.636 - 31ms  - 1ms
// create map      - 14:12:22.636 - 31ms  - 0ms
// populate object - 14:12:22.669 - 63ms  - 32ms
// populate map    - 14:12:22.778 - 172ms - 109ms
// access object   - 14:12:22.800 - 194ms - 22ms
// access map      - 14:12:22.860 - 254ms - 60ms
// end timer       - 14:12:22.861 - 255ms - 1ms

// start timer     - 14:14:02.700 - 2ms   - 2ms
// populate range  - 14:14:02.719 - 22ms  - 20ms
// create object   - 14:14:02.720 - 22ms  - 0ms
// create map      - 14:14:02.720 - 22ms  - 0ms
// populate object - 14:14:02.759 - 62ms  - 30ms
// populate map    - 14:14:02.855 - 157ms - 95ms
// access object   - 14:14:02.875 - 177ms - 20ms
// access map      - 14:14:02.927 - 228ms - 51ms
// end timer       - 14:14:02.927 - 229ms - 1ms
