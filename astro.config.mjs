import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
	site: "https://markdown-badges.vercel.app",
	integrations: [tailwind(), vue(), sitemap()],
	output: "server",
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
});
