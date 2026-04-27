export function getBadgeSEOData(badge: Badge) {
  const description = `${badge.name} badge for GitHub README. Copy the ready-to-use Markdown code and add the ${badge.name} badge to your README, profile, or developer documentation.`;
  const keywords = [
    `${badge.name} badge`,
    `${badge.name} markdown badge`,
    `${badge.name} github badge`,
    `${badge.name} badge for github readme`,
    `${badge.name} readme badge`,
    `${badge.category} badge`,
    "markdown badges",
    "github readme badges",
    "github profile badges",
    "shields badges",
  ];

  const siteUrl = import.meta.env.SITE;
  const pageUrl = `${siteUrl}/badges/${badge.id}`;

  return {
    title: `${badge.name} Badge - Markdown Badges`,
    description,
    type: "article" as const,
    keywords: keywords.join(", "),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        name: `${badge.name} Badge`,
        headline: `${badge.name} Badge`,
        description,
        image: badge.url,
        url: pageUrl,
        keywords: keywords.join(", "),
        datePublished: "2024-01-01",
        dateModified: "2024-01-01",
        author: {
          "@type": "Person",
          name: "GFrancV",
          url: "https://github.com/GFrancV",
        },
        publisher: {
          "@type": "Organization",
          name: "Markdown Badges",
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/favicon/favicon-32x32.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        codeRepository: "https://github.com/GFrancV/markdown-badges",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Badges",
            item: `${siteUrl}/badges`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${badge.name} Badge`,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
