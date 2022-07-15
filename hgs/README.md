# Herbert George Sculpture

[www.herbertgeorgesculpture.com](www.herbertgeorgesculpture.com)

## Files and dependencies

- `data` contains all of the data about Herbert's work
  - `sculptures.js` exports each sculpture
  - `periods.js` exports each period and the sculptures that belong to it
  - `writings.js` exports each work of writing
  - `resume.js` exports each resume section and its items
- `functions` contains the functions used to build the site
  - `build.js` takes the source files and builds the website
  - `filesystem.js` contains functions used to load and save files
  - `path.js` formalizes and gives access to the file structure of this repo
  - `render.js` creates rendering functions for each template
- `templates` contains the templates used to build the site
- `package.json` contains project info and dependencies
  - `mustache` is used for templating
  - `markdown-it` is used for Markdown rendering of period statements
- `scripts.js` contains scripts used by the website
- `styles.css` contains shared styles used by the website

## Images

This website contains a lot of large images and Git isn't very good at handling
binary data. Thus, the images should be copied from another source that better
handles large files. You can currently access them via [my Dropbox](
https://www.dropbox.com/sh/kn9xm8gjj1fdjvp/AAAC2tipDXc5NU0CcjTcPXHba).

Don't look too closely at this directory, it's poorly organized and needs some
love. The sculpture definitions in `sculptures.js` contain paths relative to
this directory.

## Building the site

This is intended to be a simple, static site that works with minimal scripting
that focuses on the sculptures and their organization into periods.

To build the website and view it locally:

1. Install dependencies via `npm install`
2. In `paths.js`, update `pwd` to wherever you put this repo
3. Run `node functions/build.js`
4. Navigate to the newly created `www` output directory
5. Run `python -m SimpleHTTPServer 8000` (or an equivalent)
6. Visit `localhost:8000`

## Publishing changes

Files are uploaded to my service provider via SFTP. See me for credentials.

SSH/SFTP Hostname: `ssh.phx.nearlyfreespeech.net`

## Remaining work

There are several things I'd like to improve. Some of them are more important
than others.

- Fix styling in Safari
  - `gap` doesn't work with flexbox so we should use grid
  - `object-fit` doesn't seem to work
- Reorganize `images`
  - I'm thinking that each sculpture will get its own subdir
- Rework all of the styles to make them simpler and more cohesive
- Fix small-screen styling on writings and resume
- Add a step to the build phase that optimizes images for web
- Create thumbnails for each sculpture + period
  - I think these could be defined as coordinates in `data` and then generated
- Revisit the scripts for navigating sculpture images
- Get the `pwd` automatically instead of manually defining it in `paths.js`
- Add certification for `https`
- Improve font loading
