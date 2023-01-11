! function() {
    "use strict";

    function s(s) {
        s.setAttribute("data-hypothesis-asset", "")
    }

    function t(t, e) {
        var n = t.createElement("link");
        n.rel = "stylesheet", n.type = "text/css", n.href = e, s(n), t.head.appendChild(n)
    }

    function e(t, e) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            r = n.esModule,
            o = void 0 === r || r,
            a = n.forceReload,
            i = void 0 !== a && a,
            l = t.createElement("script");
        o && (l.type = "module"), i && (e += "#ts=".concat(Date.now())), l.src = e, l.async = !1, s(l), t.head.appendChild(l)
    }

    function n(t, e, n, r) {
        var o = t.createElement("link");
        o.rel = e, o.href = r, o.type = "application/annotator+".concat(n), s(o), t.head.appendChild(o)
    }

    function r(t, e, n) {
        var r = t.createElement("link");
        r.rel = "preload", r.as = e, r.href = n, "fetch" === e && (r.crossOrigin = "anonymous"), s(r), t.head.appendChild(r)
    }

    function o(s, t) {
        return s.assetRoot + "build/" + s.manifest[t]
    }

    function a(s) {
        var t = s.match(/(https?):\/\/([^:/]+)/);
        return t ? {
            protocol: t[1],
            hostname: t[2]
        } : null
    }

    function i() {
        var s = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document,
            t = s.currentScript;
        return t ? a(t.src) : null
    }

    function l(s) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document;
        if (-1 === s.indexOf("{")) return s;
        var e = i(t);
        if (!e) throw new Error("Could not process URL template because script origin is unknown");
        return s = (s = s.replace("{current_host}", e.hostname)).replace("{current_scheme}", e.protocol)
    }
    var c = {
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
    if (function() {
            var s = [function() {
                return Object.fromEntries([])
            }, function() {
                return new URL(document.location.href)
            }, function() {
                return new Request("https://hypothes.is")
            }, function() {
                return Element.prototype.attachShadow
            }, function() {
                return CSS.supports("display: grid")
            }, function() {
                return document.evaluate("/html/body", document, null, XPathResult.ANY_TYPE, null), !0
            }];
            try {
                return s.every((function(s) {
                    return s()
                }))
            } catch (s) {
                return !1
            }
        }()) {
        var p = function(s) {
                for (var t = {}, e = s.querySelectorAll("script.js-hypothesis-config"), n = 0; n < e.length; n++) {
                    var r = void 0;
                    try {
                        r = JSON.parse(e[n].textContent || "")
                    } catch (s) {
                        console.warn("Could not parse settings from js-hypothesis-config tags", s), r = {}
                    }
                    Object.assign(t, r)
                }
                return t
            }(document),
            u = l(p.assetRoot || "https://cdn.hypothes.is/hypothesis/1.1168.0/");
        if (document.querySelector("hypothesis-app")) {
            ! function(s, n) {
                r(s, "fetch", n.apiUrl), r(s, "fetch", n.apiUrl + "links");
                for (var a = 0, i = ["scripts/sidebar.bundle.js"]; a < i.length; a++) e(s, o(n, i[a]), {
                    esModule: !0
                });
                for (var l = 0, c = ["styles/katex.min.css", "styles/sidebar.css"]; l < c.length; l++) t(s, o(n, c[l]))
            }(document, {
                assetRoot: u,
                manifest: c,
                apiUrl: p.apiUrl
            })
        } else {
            var d = p,
                h = l(d.notebookAppUrl || "https://hypothes.is/notebook"),
                y = l(d.sidebarAppUrl || "https://hypothes.is/app.html");
            ! function(s, a) {
                if (!s.querySelector('link[type="application/annotator+html"]')) {
                    n(s, "sidebar", "html", a.sidebarAppUrl), n(s, "notebook", "html", a.notebookAppUrl), r(s, "style", o(a, "styles/annotator.css")), n(s, "hypothesis-client", "javascript", a.assetRoot + "build/boot.js");
                    for (var i = 0, l = ["scripts/annotator.bundle.js"]; i < l.length; i++) e(s, o(a, l[i]), {
                        esModule: !1
                    });
                    var c = [];
                    void 0 !== window.PDFViewerApplication && c.push("styles/pdfjs-overrides.css"), c.push("styles/highlights.css");
                    for (var p = 0, u = c; p < u.length; p++) t(s, o(a, u[p]))
                }
            }(document, {
                assetRoot: u,
                manifest: c,
                notebookAppUrl: h,
                sidebarAppUrl: y
            })
        }
    } else console.warn("The Hypothesis annotation tool is not supported in this browser. See https://web.hypothes.is/help/which-browsers-are-supported-by-hypothesis/.")
}();
