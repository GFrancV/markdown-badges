import { afterEach, describe, expect, it, vi } from "vitest";
import { getIcons } from "../src/services/simple-icons";

afterEach(() => vi.unstubAllGlobals());

describe("getIcons", () => {
  it("fetches the same-origin slim list", async () => {
    const icons = [{ title: "GitHub", slug: "github", hex: "181717" }];
    const fetch = vi.fn().mockResolvedValue(Response.json(icons));
    vi.stubGlobal("fetch", fetch);

    await expect(getIcons()).resolves.toEqual(icons);
    expect(fetch.mock.calls[0][0]).toBe("/simple-icons.json");
  });

  it("throws on HTTP errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("nope", { status: 404 })),
    );

    await expect(getIcons()).rejects.toThrow("HTTP 404");
  });
});
