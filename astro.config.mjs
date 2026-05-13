import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://markdown-badges.vercel.app",
  integrations: [
    sitemap({
      customPages: [
        "https://markdown-badges.vercel.app/",
        "https://markdown-badges.vercel.app/badges",
        "https://markdown-badges.vercel.app/generator",
        "https://markdown-badges.vercel.app/about",
      ],
    }),
    react(),
  ],
  output: "server",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  vite: {
    plugins: [tailwindcss()],
  },
});
