// import { mkdir, rmdir, paths, load, save, website } from "/functions/files.js";
// import * as render from "/functions/render.js";

import { file, directory } from "../functions/filesystem.js";
import { templates, markdown } from "../functions/render.js";
import { files, links } from "../functions/paths.js";
import { recent_work, past_work, sited_works } from "../data/periods.js";

const page_at = path => ({
  titled: title => ({
    of: content => file.save(
      path,
      templates.page(title, content)
    )
  })
});

function refresh_output() {
  directory.remove(files.www());
  directory.create(files.www());
}

function copy_images() {
  directory.copy(files.images(), files.www("images"))
}

function copy_static() {
  file.copy(files.root("styles.css"), files.www("styles.css"));
  file.copy(files.root("scripts.js"), files.www("scripts.js"));
}

function create_home() {
  const summary = period => ({
    link: links.periods(`${period.id}.html`),
    title: period.title,
    image: links.images(period.thumbnail.source),
  });

  page_at(
    files.www("index.html")
  ).titled(
    "Herbert George Sculpture"
  ).of(
    `<header>${templates.site_nav()}</header>` +
    templates.periods({
      highlight: summary(recent_work),
      periods: past_work.map((period => summary(period))),
      second_highlight: summary(sited_works),
    })
  );
}

function create_sculptures() {
  directory.create(files.www("periods"));
  directory.create(files.www("sculptures"));

  const info_lines = (info = {}) => [
    [ info.year, info.materials ].filter(x => x).join(". "),
    info.dimensions,
    ...(info.notes || []),
  ].filter(x => x);

  for (const period of [ recent_work, ...past_work, sited_works ]) {

    // render a page for each period

    page_at(
      files.www("periods", `${period.id}.html`)
    ).titled(
      period.title
    ).of(
      `<header>${templates.site_nav()}</header>` +
      templates.period({
        period: period.title,
        years: period.year,
        statement: markdown(period.statement || ""),
        sculptures: period.sculptures.map(sculpture => ({
          link: links.sculptures(`${sculpture.id}.html`),
          title: sculpture.title,
          image: links.images((sculpture.thumbnail || sculpture.images[0]).source),
        }))
      })
    )

    // render a page for each of the period's sculptures

    for (const sculpture of Object.values(period.sculptures)) {
      page_at(
        files.www("sculptures", `${sculpture.id}.html`)
      ).titled(
        sculpture.title
      ).of(
        `<header>${templates.site_nav()}</header>` +
        templates.sculpture({
          title: sculpture.title,
          period: period.title,
          period_url: `/periods/${period.id}.html`,
          info: info_lines(sculpture.info),
          captioning: sculpture.captioning,
          videos: (sculpture.videos || []).map(video => ({
            thumbnail: links.images(video.thumbnail),
            source: links.images(video.source)
          })),
          images: sculpture.images.map(image => ({
            source: links.images(image.source)
          })),
        })
      )
    }
  }
}

function create_sited_works() {
  page_at(
    files.www("periods/sited-works.html")
  ).titled(
    "Sited Works"
  ).of(
    `<header>${templates.site_nav()}</header>` +
    templates.sited_works()
  );
}

function create_writings() {
  page_at(
    files.www("writings.html")
  ).titled(
    "Writings"
  ).of(
    `<header>${templates.site_nav()}</header>` +
    templates.writings()
  );
}

function create_resume() {
  page_at(
    files.www("resume.html")
  ).titled(
    "Résumé"
  ).of(
    `<header>${templates.site_nav()}</header>` +
    templates.resume()
  );
}

// refresh_output();
// copy_images();
copy_static();
create_home();
create_sculptures();
create_sited_works();
create_writings();
create_resume();
