// usage: mustache.render(template, params, partials)
import mustache from "mustache";
import markdown_it from "markdown-it";

import { path, files } from "../functions/paths.js";
import { file, directory } from "../functions/filesystem.js";

const markdown_renderer = markdown_it();
const template = filename => file.load(files.templates(filename));

export const markdown = content => markdown_renderer.render(content);

export const templates = {
  render: (path, params, partials) => mustache.render(
    template(path),
    params,
    partials,
  ),

  page: (title, content) => (
    mustache.render(
      template("page.mustache"),
      { title },
      { content }
    )
  ),

  period: ({ period, years, sculptures, statement }) => (
    mustache.render(
      template("period.mustache"),
      { period, years, sculptures },
      { statement }
    )
  ),

  periods: ({ highlight, periods, second_highlight }) => (
    mustache.render(
      template("periods.mustache"),
      { highlight, periods, second_highlight }
    )
  ),

  sculpture: ({ title, period, period_url, info, captioning, videos, images }) => (
    mustache.render(
      template("sculpture.mustache"),
      { title, period, period_url, info, captioning, videos, images }
    )
  ),

  sited_works: () => (
    mustache.render(
      template("sited-works.mustache")
    )
  ),

  site_nav: () => (
    mustache.render(
      template("site-nav.mustache")
    )
  ),

  writings: () => (
    mustache.render(
      template("writings.mustache")
    )
  ),

  resume: () => (
    mustache.render(
      template("resume.mustache")
    )
  )
};
