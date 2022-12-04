import fs from "fs";

const bookmarks = JSON.parse(
  fs.readFileSync("./raw-bookmarks.json")
).map((bookmark, index) => [ index, bookmark ]).reverse();

const processed = new Set();
const output = {};

for (const [ index, bookmark ] of bookmarks) {
  const url = bookmark.url;

  if (processed.has(url)) {
    output[index] = [ "DELETE" ];
  } else {
    processed.add(url);
  }
}

console.log(JSON.stringify(output, null, 2));
