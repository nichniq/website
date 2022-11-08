const path = require("path");
const fs = require('fs');
const https = require('https');

const pinterest_data = require('./part-one.json');

const pin_id = ({ pin_url }) => /pin\/(.*?)\//.exec(pin_url)[1];

const pins = [];

for (const board of pinterest_data.boards) {
  for (const pin of board.pins || []) {
    pins.push({ dir: path.join("Part One", board.title), id: pin_id(pin), img: pin.img_url });
  }

  for (const section of board.sections || []) {
    for (const pin of section.pins || []) {
      pins.push({ dir: path.join("Part One", board.title, section.title), id: pin_id(pin), img: pin.img_url });
    }
  }
}

const download = (url, filepath) => {
  https.get(url, response => {
      response.pipe(fs.createWriteStream(filepath));
  });
};

for (const pin of pins) {
  const { dir, id, img } = pin;
  const img_path = path.join(dir, id) + path.extname(img);

  if (fs.existsSync(img_path)) {
    continue;
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  download(img, img_path);
}
