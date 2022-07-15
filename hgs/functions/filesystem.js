import fs from "fs";

import { path } from "../functions/paths.js";

export const file = {
  copy: (from, to) => { fs.copyFileSync(from, to) },
  load: path => fs.readFileSync(path, "utf-8"),
  remove: path => { fs.unlinkSync(path) },
  save: (path, content) => { fs.writeFileSync(path, content) },
}

export const directory = {
  copy: (from, to) => {
    directory.create(to);

    for (const name of directory.read(from)) {
      const source = path.relative(from, name);
      const destination = path.relative(to, name);
      const isDirectory = fs.lstatSync(source).isDirectory();
      const copy = isDirectory ? directory.copy : file.copy;

      copy(source, destination);
    }
  },
  create: path => { fs.mkdirSync(path, { recursive: true }) },
  read: path => fs.readdirSync(path),
  remove: path => { fs.rmdirSync(path, { recursive: true }) },
}
