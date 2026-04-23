import { BadgeCard } from "@/components/badges/badge-card";
import { ClientProviders } from "@/components/client-providers";

export function BadgesList({ badges }: { badges: Badge[] }) {
  return (
    <ClientProviders>
      <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </ClientProviders>
  );
}
