import tags from "/modules/tags.js";
import sample from "/dsl/sample.js";

const { textarea } = tags;

const [ input ] = textarea(sample, { type: "text", readonly: "readonly" });

document.body.append(input);
