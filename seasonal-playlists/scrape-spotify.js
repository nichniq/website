/**
 * Go to a Spotify playlist and execute the following code to scrape the
 * playlist and track information. I think at one point, I think the playlist
 * track rows were loaded lazily, so I had to minimize the page to get all of
 * them on the page. This doesn't seem to be the case anymore, but the script
 * is including the suggested songs that come after the playlist, so I manually
 * removed those.
 *
 * To make this a bookmarklet, save the following as a bookmark:
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
