import { promises as fs_promises } from "fs";
import node_path from "path";

import { partition, group } from "../modules/lisp.js";

export const get_files = path => (
  fs_promises.readdir(path, { withFileTypes: true })

  .then(dirents => partition(dirents, [
    dirent => dirent.isDirectory(),
    dirnet => dirnet.isFile(),
  ]))

  .then(([ directories, files ]) => {
    if (directories.length > 0) {
      return (
        Promise.all(
          directories.map(
            dir => get_files(node_path.resolve(path, dir.name))
          )
        )
        .then(recursive_directories => [
          directories.map(
            (directory, index) => [ directory, recursive_directories[index] ]
          ),
          files,
        ])
      );
    }

    return [ directories, files ];
  })

  .then(([ directories, files ]) => ({
    directories: directories.map(
      ([ { name }, content ]) => [ name, content ]
    ),
    files: group(
      files.map( ({ name }) => name ),
      name => node_path.extname(name)
    )
  }))
);
