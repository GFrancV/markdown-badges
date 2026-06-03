declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

interface AnalyticsEvents {
  badge_copied: {
    badge_name: string;
    category: string;
  };

  badge_selected: {
    badge_name: string;
    category: string;
  };

  badge_search: {
    query_length: number;
    results_count: number;
    has_results: boolean;
  };

  search_no_results: {
    query: string;
  };

  multi_copy: {
    selected_count: number;
  };

  selection_cleared: undefined;

  favorite_toggled: {
    badge_name: string;
    category: string;
    action: "added" | "removed";
  };
}

function trackEvent<K extends keyof AnalyticsEvents>(
  event: K,
  data?: AnalyticsEvents[K],
) {
  if (typeof window === "undefined") return;

  window.umami?.track(
    event,
    data ? (data as Record<string, unknown>) : undefined,
  );
}

export function trackBadgeCopied(badgeName: string, category: string): void {
  trackEvent("badge_copied", {
    badge_name: badgeName,
    category,
  });
}

export function trackBadgeSelected(badgeName: string, category: string): void {
  trackEvent("badge_selected", {
    badge_name: badgeName,
    category,
  });
}

export function trackBadgeSearch(
  queryLength: number,
  resultsCount: number,
  hasResults: boolean,
): void {
  trackEvent("badge_search", {
    query_length: queryLength,
    results_count: resultsCount,
    has_results: hasResults,
  });
}

export function trackSearchNoResults(query: string): void {
  trackEvent("search_no_results", {
    query,
  });
}

export function trackMultiCopy(selectedCount: number): void {
  trackEvent("multi_copy", {
    selected_count: selectedCount,
  });
}

export function trackSelectionCleared(): void {
  trackEvent("selection_cleared");
}

export function trackFavoriteToggled(
  badgeName: string,
  category: string,
  action: "added" | "removed",
): void {
  trackEvent("favorite_toggled", {
    badge_name: badgeName,
    category,
    action,
  });
}
