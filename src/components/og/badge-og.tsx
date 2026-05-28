import { MarkdownDark } from "../ui/svgs/markdownDark";

const PRIMARY = "#d47898";
const BG = "#0f0f0f";
const SURFACE = "#181818";
const BORDER = "rgba(255,255,255,0.1)";
const MUTED = "#717171";
const TEXT = "#fafafa";

type BadgeOgProps = {
  badge: Badge;
  badgeImage: string | null;
  badgeDims: { width: number; height: number } | null;
};

export function BadgeOg({ badge, badgeImage, badgeDims }: BadgeOgProps) {
  const { name, categories, markdown } = badge;

  const truncatedMarkdown =
    markdown.length > 70 ? markdown.slice(0, 70) + "…" : markdown;

  const fontSize = name.length > 22 ? 68 : name.length > 14 ? 78 : 88;

  // Scale badge image to a height of 40px in the OG canvas
  const DISPLAY_HEIGHT = 40;
  const displayWidth =
    badgeDims && badgeDims.height > 0
      ? Math.round((DISPLAY_HEIGHT / badgeDims.height) * badgeDims.width)
      : 200;

  return (
    <div
      style={{ backgroundColor: BG, color: TEXT, position: "relative" }}
      tw="flex flex-col w-full h-full overflow-hidden"
    >
      {/* Radial glow — top-left */}
      <div
        style={{
          position: "absolute",
          top: -140,
          left: -100,
          width: 520,
          height: 520,
          background: `radial-gradient(circle, ${PRIMARY}22 0%, transparent 68%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top accent bar */}
      <div style={{ backgroundColor: PRIMARY, height: 4, flexShrink: 0 }} />

      {/* Content */}
      <div tw="flex flex-col flex-1 px-16 py-10">
        {/* Header */}
        <div
          style={{ marginBottom: 36 }}
          tw="flex items-center justify-between"
        >
          <div style={{ gap: 10 }} tw="flex items-center">
            <MarkdownDark width="38" height="24" />
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: TEXT,
                letterSpacing: "-0.3px",
              }}
            >
              Markdown Badgesa
            </span>
          </div>
          <span style={{ color: MUTED, fontSize: 16 }}>
            markdown-badges.vercel.app
          </span>
        </div>

        {/* Hero: badge image + name */}
        <div style={{ flex: 1, gap: 20 }} tw="flex flex-col justify-center">
          {badgeImage && badgeDims && (
            <div tw="flex">
              <img
                src={badgeImage}
                width={displayWidth}
                height={DISPLAY_HEIGHT}
                alt={name}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <div
            style={{
              fontSize,
              display: "flex",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-3px",
              gap: 18,
              color: TEXT,
            }}
          >
            {name}
            <span
              style={{
                fontSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-3px",
                color: PRIMARY,
              }}
            >
              Badge
            </span>
          </div>
          {/* Categories */}
          <div style={{ gap: 8 }} tw="flex flex-wrap">
            {categories.map((cat) => (
              <span
                key={cat}
                style={{
                  backgroundColor: SURFACE,
                  border: `1px solid ${BORDER}`,
                  color: MUTED,
                  fontSize: 14,
                  padding: "5px 14px",
                  borderRadius: 6,
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ marginTop: 0, gap: 12 }} tw="flex flex-col">
          {/* Markdown snippet */}
          <div
            style={{
              marginTop: 28,
              backgroundColor: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: "10px 16px",
              color: "#a0a0a0",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: PRIMARY, fontWeight: 600 }}>$</span>
            <span>{truncatedMarkdown}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
