/**
 * Go to Spotify
 * To make this a bookmarklet, save like the following:
 *
 * javascript:(function(){})()
*/

const playlist_title = document.querySelector("h1").textContent;

const playlist_id = document.querySelector(
  '[data-testid="playlist-page"]'
).dataset.testUri.split(":")[2];

const songs = [
  ...document.querySelectorAll("[data-testid='tracklist-row']")
].map(row => ({
  title: row.querySelector("[dir='auto']").textContent,
  artist: row.querySelector("[draggable=true]").textContent,
}));

const indent = (spaces, text) => " ".repeat(spaces) + text;

const output = [
  `[ "${playlist_title}", {`,
  `  ids: [ [ "spotify", "${playlist_id}" ] ],`,
  `  tracks: [`,
  ...songs.map(({ title, artist }) => `    { title: "${title}", artist: "${artist}" },`),
  `  ]`,
  `} ],`,
].join("\n");

/* 5. Copy the list to the clipboard */
navigator.clipboard.writeText(output);

javascript:(function() {
  const playlist_title = document.querySelector("h1").textContent;

  const playlist_id = document.querySelector(
    '[data-testid="playlist-page"]'
  ).dataset.testUri.split(":")[2];

  const songs = [
    ...document.querySelectorAll("[data-testid='tracklist-row']")
  ].map(row => ({
    title: row.querySelector("[dir='auto']").textContent,
    artist: row.querySelector("[draggable=true]").textContent,
  }));

  const indent = (spaces, text) => " ".repeat(spaces) + text;

  const output = [
    `[ "${playlist_title}", {`,
    `  ids: [ [ "spotify", "${playlist_id}" ] ],`,
    `  tracks: [`,
    ...songs.map(({ title, artist }) => `    { title: "${title}", artist: "${artist}" },`),
    `  ]`,
    `} ],`,
  ].join("\n");

  /* 5. Log output and copy to clipboard */
  console.log(output);
  navigator.clipboard.writeText(output);
})()
