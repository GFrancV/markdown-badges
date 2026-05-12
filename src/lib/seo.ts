import { slugifyCategory } from "@/services/badges";

const baseUrl = import.meta.env.SITE ?? "https://markdown-badges.vercel.app";

const authorObject = {
  "@type": "Person",
  name: "GFrancV",
  url: "https://gfrancv.vercel.app",
  logo: {
    "@type": "ImageObject",
    url: "https://gfrancv.vercel.app/images/gfrancv.webp",
    width: "460",
    height: "460",
  },
  sameAs: ["https://x.com/gfrancv", "https://github.com/gfrancv"],
};

const organizationObject = {
  "@type": "Organization",
  name: "Markdown Badges",
  logo: {
    "@type": "ImageObject",
    url: `${baseUrl}/favicon.svg`,
  },
};

export function getBadgeDescription(badge: Badge): string {
  return `${badge.name} badge for GitHub README. Copy the ready-to-use Markdown code and add the ${badge.name} badge to your README, profile, or developer documentation.`;
}

export function getBaseJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": baseUrl,
    name: "Markdown Badges",
    alternateName: "MD Badges",
    url: baseUrl,
    description:
      "Markdown badges generator for GitHub README. Browse 600+ badges for languages, frameworks, tools and platforms and copy ready-to-use Markdown instantly.",
    inLanguage: "en-US",
    publisher: authorObject,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbJsonLd(pathSegments: string[]): object {
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ];

  if (pathSegments.length > 0) {
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbItems.push({
        "@type": "ListItem",
        position: index + 2,
        name:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        item: `${baseUrl}${currentPath}`,
      });
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };
}

export function getBadgeJsonLd(badge: Badge, pageUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": pageUrl,
    url: pageUrl,
    headline: `${badge.name} Badge`,
    description: getBadgeDescription(badge),
    image: {
      "@type": "ImageObject",
      url: badge.url,
      width: "100",
      height: "32",
    },
    inLanguage: "en-US",
    articleSection: badge.categories[0],
    dateModified: new Date().toISOString(),
    mainEntityOfPage: { "@id": pageUrl },
    author: authorObject,
    publisher: organizationObject,
    isPartOf: { "@id": baseUrl },
  };
}

export function getBadgeCategoryJsonLd(
  categoryName: string,
  badgeCount: number
): object {
  const badgeCategoryUrl = `${baseUrl}/categories/${slugifyCategory(categoryName)}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": badgeCategoryUrl,
    url: badgeCategoryUrl,
    name: `${categoryName} Badges`,
    description: `Browse ${badgeCount} ${categoryName} badges for GitHub README. Copy ready-to-use Markdown instantly.`,
    inLanguage: "en-US",
    numberOfItems: badgeCount,
    author: authorObject,
    isPartOf: { "@id": baseUrl },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${badgeCategoryUrl}/?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
