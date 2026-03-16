/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Badge {
  id: string;
  name: string;
  url: string;
  markdown: string;
  category: string;
}

interface SimpleIcon {
  title: string;
  hex: string;
  source: string;
  aliases?: Aliases;
  license?: License;
  guidelines?: string;
}

interface Aliases {
  aka: string[];
}

interface License {
  type: string;
}
