While reading the article "[How do I export my annotations?][1]", I saw a reference to Hypthosis, a tool that allows you to annotate web pages.

It works as a Chrome extension and as a bookmarklet. Since I use Firefox, I had to use the bookmarklet. I was curious how they go around CORS request, so I downloaded the script `./bookmarklet-minified.js`. However, the code was minified, so I did my best to translate it `./bookmarklet-expanded.js`. I'm still not sure how they do the CORS stuff (that logic might be in a different script that is loaded from the bookmarklet script). Still, I saw some interesting use of `<link>` elements that I might look more into later.

Hypothesis looks promising and has a nice UI, but they make it difficult to access your data outside of their platform. There isn't a [built-in way to export data][2], although someone did make an [export prototype][3].

[1]: https://beepb00p.xyz/annotating.html
[2]: https://web.hypothes.is/help/how-do-i-export-my-annotations/
[3]: https://jonudell.info/h/facet/
