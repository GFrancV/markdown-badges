import { getBadges } from "@/services/badges";
import { BadgeCard } from "./badge-card";
import { BadgeSidebarProvider } from "./badge-sidebar";

export function BadgesList() {
  const badges = getBadges();

  return (
    <BadgeSidebarProvider>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </BadgeSidebarProvider>
  );
}
