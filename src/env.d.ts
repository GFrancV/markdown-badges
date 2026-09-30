/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Badge {
  id: string;
  name: string;
  url: string;
  markdown: string;
  categories: string[];
}

interface SimpleIcon {
  title: string;
  slug: string;
  hex: string;
}
