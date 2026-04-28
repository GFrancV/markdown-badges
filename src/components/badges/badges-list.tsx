import { BadgeCard } from "@/components/badges/badge-card";
import { ClientProviders } from "@/components/client-providers";
import { useSelection } from "@/context/selection-context";

type BadgesListProps = {
  badges: Badge[];
  selectable?: boolean;
};

export function BadgesList({ badges, selectable = false }: BadgesListProps) {
  const { isSelected, toggle } = useSelection();

  return (
    <ClientProviders>
      <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            selectable={selectable}
            isSelected={selectable && isSelected(badge.id)}
            onToggle={toggle}
          />
        ))}
      </div>
    </ClientProviders>
  );
}
