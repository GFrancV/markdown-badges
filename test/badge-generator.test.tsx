/**
 * SSR render of the generator: covers initialSearch → state → markup.
 * Interactions (typing, picking icons, URL sync) need a DOM env (not installed).
 */
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BadgeGenerator } from "../src/components/badge-generator";

const render = (initialSearch?: string) =>
  renderToString(<BadgeGenerator initialSearch={initialSearch} />).replaceAll(
    "&amp;",
    "&",
  );

describe("BadgeGenerator (SSR)", () => {
  it("renders the default GitHub badge", () => {
    const html = render();
    expect(html).toContain(
      "https://img.shields.io/badge/GitHub-1000?style=for-the-badge&logo=github&logoColor=ffffff",
    );
    expect(html).toContain("Show icon");
    expect(html).toContain(">Logo<");
  });

  it("restores config from the query string", () => {
    const html = render(
      "?name=Next-Auth&logo=nodedotjs&labelColor=5fa04e&style=flat-square",
    );
    expect(html).toContain("/badge/Next--Auth-1000?style=flat-square&logo=nodedotjs");
    expect(html).toContain("labelColor=5fa04e");
    expect(html).toContain('value="Next-Auth"');
  });

  it("hides the logo picker and logo params when icon=0", () => {
    const html = render("?icon=0");
    expect(html).not.toContain("logo=");
    expect(html).not.toContain(">Logo<");
    expect(html).not.toContain("Logo color");
  });

  it("keeps a shared name inside the markdown alt text", () => {
    const html = render(`?name=${encodeURIComponent("x](https://evil.example) [y")}`);
    // hljs wraps tokens in spans; compare the visible text
    const text = html.replaceAll(/<[^>]+>/g, "");
    expect(text).toContain(String.raw`![x\](https://evil.example) \[y](`);
  });

  it("escapes the name in the HTML snippet", () => {
    const html = render(`?name=${encodeURIComponent('"><script>')}`);
    expect(html).not.toContain("<script>");
  });
});
