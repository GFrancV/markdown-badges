import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const badges = defineCollection({
  loader: file("src/data/badges.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    markdown: z.string(),
    category: z.string(),
  }),
});

export const collections = { badges };
