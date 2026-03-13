import hljs from "highlight.js/lib/core";
import markdown from "highlight.js/lib/languages/markdown";
import plaintext from "highlight.js/lib/languages/plaintext";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("plaintext", plaintext);

export { hljs };
