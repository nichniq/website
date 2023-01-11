/*
 * This script was derived from a minified version of a bookmarklet and hasn't
 * been tested. Function and variable names are best guesses.
 */

"use strict";

function mark_hypo_asset(element) {
    element.setAttribute("data-hypothesis-asset", "")
}

function add_stylesheet(doc, href) {
    const stylesheet = doc.createElement("link");

    stylesheet.rel = "stylesheet";
    stylesheet.type = "text/css";
    stylesheet.href = href;

    mark_hypo_asset(stylesheet);
    doc.head.appendChild(stylesheet);
}

function add_script(doc, src, options = {}) {
    const script = doc.createElement("script");

    if (options.esModule) {
      (script.type = "module");
    }

    if (options.forceReload) {
      src += `#ts=${Date.now()}`;
    }

    script.src = src;
    script.async = false;

    mark_hypo_asset(script);
    doc.head.appendChild(script);
}

function add_annotator_resoure(doc, relationship, type, href) {
    const resource = doc.createElement("link");

    resource.rel = relationship;
    resource.href = href;
    resource.type = `application/annotator+${type}`;

    mark_hypo_asset(resource);
    doc.head.appendChild(resource);
}

function add_preloaded_resource(doc, type, href) {
    const resource = doc.createElement("link");

    resource.rel = "preload";
    resource.as = type;
    resource.href = href;

    if ("fetch" === type) {
        resource.crossOrigin = "anonymous";
    }

    mark_hypo_asset(resource);
    doc.head.appendChild(resource);
}

function asset_path(app_config, asset) {
    return app_config.assetRoot + "build/" + app_config.manifest[asset];
}

function url_origin(url) {
    const matches = url.match(/(https?):\/\/([^:/]+)/);

    return matches ? {
        protocol: matches[1],
        hostname: matches[2]
    } : null;
}

function current_script_origin(doc = document) {
    const script = doc.currentScript;

    return doc ? url_origin(doc.src) : null
}

function asset_origin(str, doc = document) {
    if (!str.includes("{")) {
        return str;
    }

    const origin = current_script_origin(doc);

    if (!origin) {
        throw new Error("Could not process URL template because script origin is unknown");
    }

    return str.replace("{current_host}", origin.hostname).replace("{current_scheme}", origin.protocol);
}

const asset_builds = {
    "scripts/annotator.bundle.js": "scripts/annotator.bundle.js?3d1813",
    "styles/annotator.css": "styles/annotator.css?c10c10",
    "styles/annotator.css.map": "styles/annotator.css.map?02fa76",
    "styles/highlights.css": "styles/highlights.css?6b4ebd",
    "styles/highlights.css.map": "styles/highlights.css.map?241350",
    "styles/katex.min.css": "styles/katex.min.css?e9b69c",
    "styles/katex.min.css.map": "styles/katex.min.css.map?42d80c",
    "styles/pdfjs-overrides.css": "styles/pdfjs-overrides.css?c95edf",
    "styles/pdfjs-overrides.css.map": "styles/pdfjs-overrides.css.map?1d8ac6",
    "styles/sidebar.css": "styles/sidebar.css?a2eb2f",
    "styles/sidebar.css.map": "styles/sidebar.css.map?11867c",
    "styles/ui-playground.css": "styles/ui-playground.css?2d33ae",
    "styles/ui-playground.css.map": "styles/ui-playground.css.map?c6c3ae",
    "scripts/annotator.bundle.js.map": "scripts/annotator.bundle.js.map?6eefb8",
    "scripts/ui-playground.bundle.js": "scripts/ui-playground.bundle.js?8b6a33",
    "scripts/sidebar.bundle.js": "scripts/sidebar.bundle.js?cd337e",
    "scripts/ui-playground.bundle.js.map": "scripts/ui-playground.bundle.js.map?e0e9f5",
    "scripts/sidebar.bundle.js.map": "scripts/sidebar.bundle.js.map?dbe94d"
};

function confirm_prereqs() {
    const requirements = [
        function obj_from_entries() { return Object.fromEntries([]) },
        function current_url() { return new URL(document.location.href) },
        function hypothesis_request() { return new Request("https://hypothes.is") },
        function attach_shadow() { return Element.prototype.attachShadow },
        function supports_css_grid() { return CSS.supports("display: grid") },
        function has_html_body() {
            document.evaluate(
                "/html/body", // xpathExpression
                document, // contextNode
                null, // namespaceResolver
                XPathResult.ANY_TYPE, // resultType
                null // result
            );
            return true;
        },
    ];

    try {
        return requirements.every(x => x());
    } catch (err) {
        return false;
    }
}

function load_hypthesis_configs(doc) {
    const output = {};

    for (const script of doc.querySelectorAll("script.js-hypothesis-config")) {
        let config;

        try {
            config = JSON.parse(script.textContent || "")
        } catch (err) {
            console.warn("Could not parse settings from js-hypothesis-config tags", err);
            config = {};
        }

        Object.assign(output, config)
    }

    return output;
}

function load_app_resources(doc, asset_config) {
    add_preloaded_resource(doc, "fetch", asset_config.apiUrl);
    add_preloaded_resource(doc, "fetch", asset_config.apiUrl + "links");

    for (const script of ["scripts/sidebar.bundle.js"]) {
        add_script(doc, asset_path(asset_config, script), { esModule: true });
    }

    for (const style of ["styles/katex.min.css", "styles/sidebar.css"]) {
        add_stylesheet(doc, asset_path(asset_config, style));
    }
}

function load_annotator_resources(doc, asset_config) {
    const annotator_resource_exists = s.querySelector('link[type="application/annotator+html"]') != null;

    if (annotator_resource_exists) {
        add_annotator_resoure(doc, "sidebar", "html", asset_config.sidebarAppUrl);
        add_annotator_resoure(doc, "notebook", "html", asset_config.notebookAppUrl);
        add_annotator_resoure(doc, "hypothesis-client", "javascript", asset_config.assetRoot + "build/boot.js");

        add_preloaded_resource(doc, "style", asset_path(asset_config, "styles/annotator.css"));

        for (const script of ["scripts/annotator.bundle.js"]) {
            add_script(doc, asset_path(asset_config, script), { esModule: false });
        }

        var stylesheets = [];

        if (window.PDFViewerApplication != null) {
            stylesheets.push("styles/pdfjs-overrides.css")
        }

        stylesheets.push("styles/highlights.css");

        for (const stylesheet of stylesheets) {
            add_stylesheet(doc, asset_path(asset_config, stylesheet));
        }
    }
}

if (confirm_prereqs()) {
    const hypothesis_configs = load_hypthesis_configs(document);
    const hypothesis_assets_origin = asset_origin(
        hypothesis_configs.assetRoot || "https://cdn.hypothes.is/hypothesis/1.1168.0/"
    );
    const app_exists = document.querySelector("hypothesis-app") != null;

    if (app_exists) {
        load_app_resources(document, {
            assetRoot: hypothesis_assets_origin,
            manifest: asset_builds,
            apiUrl: hypothesis_configs.apiUrl
        });
    } else {
        const d = hypothesis_configs;
        const notebook_assets_url = asset_origin(
            hypothesis_configs.notebookAppUrl || "https://hypothes.is/notebook"
        );
        const sidebar_assets_url = asset_origin(
            hypothesis_configs.sidebarAppUrl || "https://hypothes.is/app.html"
        );

        load_annotator_resources(document, {
            assetRoot: hypothesis_assets_origin,
            manifest: asset_builds,
            notebookAppUrl: notebook_assets_url,
            sidebarAppUrl: sidebar_assets_url,
        });
    }
} else {
    console.warn("The Hypothesis annotation tool is not supported in this browser. See https://web.hypothes.is/help/which-browsers-are-supported-by-hypothesis/.");
}
