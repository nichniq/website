import { file, directory } from "../functions/filesystem.js";

// const pwd = process.cwd().split("/");
const pwd = [ "Users", "nichniq", "hgs" ];

export const path = {
  relative: (...segments) => segments.join("/").replace(/\/+/, "/"),
  absolute: (...segments) => path.relative("/", ...segments),
  file: (...segments) => path.absolute(...pwd, ...segments),
};

export const files = {
  root: (...segments) => path.file(...segments),
  www: (...segments) => path.file("www", ...segments),
  images: (...segments) => path.file("images", ...segments),
  templates: (...segments) => path.file("templates", ...segments),
};

export const links = {
    root: (...segments) => path.absolute(...segments),
    periods: (...segments) => path.absolute("periods", ...segments),
    sculptures: (...segments) => path.absolute("sculptures", ...segments),
    images: (...segments) => path.absolute("images", ...segments),
};
