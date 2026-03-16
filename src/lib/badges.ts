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

  return {
    title: `${badge.name} Badge - Markdown Badges`,
    description,
    type: "article" as const,
    keywords: keywords.join(", "),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      name: `${badge.name} Badge`,
      headline: `${badge.name} Badge`,
      description,
      image: badge.url,
      author: {
        "@type": "Person",
        name: "GFrancV",
        url: "https://gfrancv.vercell.app",
      },
      publisher: {
        "@type": "Organization",
        name: "Markdown Badges",
        url: import.meta.env.SITE,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${import.meta.env.SITE}/badges/${badge.id}`,
      },
      codeRepository: "https://github.com/gfrancv/markdown-badges",
    },
  };
}
