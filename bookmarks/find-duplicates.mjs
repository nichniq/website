import fs from "fs";

const bookmarks = JSON.parse(
  fs.readFileSync("./unprocessed-bookmarks.json")
).reverse();

const visited = new Set();
const duplicate = new Set();

for (const bookmark of bookmarks) {
  if (visited.has(bookmark.url)) {
    duplicate.add(bookmark);
  } else {
    visited.add(bookmark.url);
  }
}

console.log(
  JSON.stringify(
    bookmarks.reverse().filter(x => !duplicate.has(x)),
    [ "title", "url", "added" ],
    2
  )
);
