import {
  ChevronDownIcon,
  ChevronsDownIcon,
  CommandIcon,
  SearchIcon,
  ShieldOffIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { BadgeCard } from "@/components/badges/badge-card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Typography } from "@/components/ui/typography";
import { filterBadges, getBadgeCategories, getBadges } from "@/services/badges";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "./ui/combobox";

type SearchProps = {
  initialQuery?: string | null;
  initialCategory?: string | null;
};

export function Search({
  initialQuery = null,
  initialCategory = null,
}: SearchProps) {
  const badges = useMemo(() => getBadges(), []);
  const categories = useMemo(() => getBadgeCategories(), []);

  const searchInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string | null>(initialQuery);
  const [categoryQuery, setCategoryQuery] = useState<string | null>(
    initialCategory,
  );
  const [resultsAmount, setResultsAmount] = useState(20);
  const [isReady, setIsReady] = useState(false);

  const [debouncedQuery] = useDebounce(query, 450);

  const filteredBadges = useMemo(() => {
    return filterBadges({
      query: isReady ? debouncedQuery : initialQuery,
      category: categoryQuery,
    });
  }, [debouncedQuery, categoryQuery, isReady, initialQuery]);

  const results = useMemo(() => {
    return filteredBadges.slice(0, resultsAmount);
  }, [filteredBadges, resultsAmount]);

  useEffect(() => {
    if (!isReady) return;

    const url = new URL(window.location.href);

    if (query && query.length > 0) url.searchParams.set("query", query);
    else url.searchParams.delete("query");

    if (categoryQuery) url.searchParams.set("category", categoryQuery);
    else url.searchParams.delete("category");

    window.history.replaceState({}, "", url);
    setResultsAmount(20);
  }, [debouncedQuery, categoryQuery, isReady]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLoadMoreResults = () => {
    setResultsAmount((prev) => prev + 20);
  };

  const handleClearQuery = () => {
    setQuery("");
  };

  return (
    <>
      <div className="flex md:flex-row flex-col gap-2 mb-10">
        <InputGroup>
          <InputGroupInput
            ref={searchInput}
            type="text"
            name="query"
            value={query ?? undefined}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${badges.length} badges`}
          />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {!query || query.length === 0 ? (
              <Kbd>
                <CommandIcon /> K
              </Kbd>
            ) : (
              <InputGroupButton
                variant="ghost"
                aria-label="clear"
                size="icon-xs"
                onClick={handleClearQuery}
              >
                <XIcon />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>

        <Combobox
          items={categories.slice(0, 15)}
          value={categoryQuery}
          onValueChange={setCategoryQuery}
          defaultValue={null}
        >
          <ComboboxTrigger
            render={
              <Button variant="outline" className="w-54 justify-between">
                <ComboboxValue placeholder="All Categories" />
                <ChevronDownIcon className="size-4 opacity-50" />
              </Button>
            }
          />
          <ComboboxContent>
            <ComboboxInput
              showTrigger={false}
              showClear
              placeholder="Seach category..."
            />
            <ComboboxEmpty>No category found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {results.length > 0 && (
        <div>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
            {results.map((badge) => (
              <BadgeCard key={badge.name} badge={badge} />
            ))}
          </div>

          {results.length < filteredBadges.length && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button onClick={handleLoadMoreResults}>
                <ChevronsDownIcon className="motion-safe:animate-bounce" />
                Load more
              </Button>
            </div>
          )}
        </div>
      )}

      {filteredBadges.length === 0 && query && query.length > 0 && (
        <div className="font-semibold text-center mt-12">
          <ShieldOffIcon className="text-gray-500 mx-auto mb-4" size={48} />
          <Typography size="h4">No badges found</Typography>
          <Typography size="h4" variant="muted">
            {query}
          </Typography>

          <div className="flex justify-center items-center gap-4 mt-4 text-neutral-300">
            <Button>
              <a
                href="https://github.com/gfrancv/markdown-badges/issues/new?labels=request&title=%5BRequest%5D%3A"
                target="_blank"
              >
                Request Badge
              </a>
            </Button>
            <Button variant="secondary" onClick={handleClearQuery}>
              Clear search
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
