import {
  ChevronsDownIcon,
  CommandIcon,
  SearchIcon,
  ShieldOffIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { BadgeCard } from "@/components/badges/badge-card";
import { filterBadges, getBadgeCategories, getBadges } from "@/services/badges";
import { Button } from "./ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Kbd } from "./ui/kbd";

export function Search({ initialQuery = "", initialCategory = "" }) {
  const badges = useMemo(() => getBadges(), []);
  const categories = useMemo(() => getBadgeCategories(), []);

  const searchInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [categoryQuery, setCategoryQuery] = useState(initialCategory);
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

    if (query.length > 0) url.searchParams.set("query", query);
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${badges.length} badges`}
          />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {query.length === 0 ? (
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

        <select
          value={categoryQuery}
          onChange={(e) => setCategoryQuery(e.target.value)}
          className="py-2 px-6 bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring-3 focus:ring-fuchsia-200 shadow-lg"
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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

      {filteredBadges.length === 0 && query.length > 0 && (
        <div className="font-semibold text-center mt-12">
          <ShieldOffIcon className="text-gray-500 mx-auto mb-4" size={48} />
          <p className="text-gray-500 text-lg">
            Don't exist any badge with this name
          </p>
          <p className="text-gray-500 text">"{query}"</p>

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
