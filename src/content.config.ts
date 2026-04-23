import { file } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const badges = defineCollection({
  loader: file("src/data/badges.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.url(),
    markdown: z.string(),
    category: z.string(),
  }),
});

export const collections = { badges };
