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
        <div className="relative grow">
          <div className="pointer-events-none absolute translate-y-[-50%] left-0 flex items-center pl-3 h-fit inset-y-1/2 text-gray-600">
            <SearchIcon />
          </div>

          <input
            ref={searchInput}
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${badges.length} badges`}
            className="block ps-12 py-2 pr-3 bg-[#1e1e1e] rounded-sm w-full border-0 text-[#f1f1ef] outline-1 -outline-offset-1 outline-transparent transition duration-200 focus:outline-2 focus:-outline-offset-2 focus:outline-fuchsia-200 leading-6 placeholder:text-neutral-600 shadow-lg"
          />

          <div className="absolute inset-y-1/2 translate-y-[-50%] right-0 flex items-center text-gray-600 pr-3 h-fit">
            {query.length === 0 ? (
              <div className="flex items-center pointer-events-none text-base gap-x-1 text-gray-500">
                <CommandIcon className="size-5" />
                <span>K</span>
              </div>
            ) : (
              <button
                onClick={handleClearQuery}
                className="text-white cursor-pointer"
              >
                <XIcon className="size-5" />
              </button>
            )}
          </div>
        </div>

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
              <button
                onClick={handleLoadMoreResults}
                className="flex gap-1 border border-transparent back rounded-full px-4 py-2 transition text-white bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200 cursor-pointer"
              >
                <ChevronsDownIcon className="motion-safe:animate-bounce" />
                Load more
              </button>
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
            <a
              href="https://github.com/gfrancv/markdown-badges/issues/new?labels=request&title=%5BRequest%5D%3A"
              target="_blank"
              className="border border-transparent back rounded-full px-3 py-2 transition bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200"
            >
              Request Badge
            </a>
            <button
              onClick={handleClearQuery}
              className="border border-transparent back rounded-full px-3 py-2 transition bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200 cursor-pointer"
            >
              Clear search
            </button>
          </div>
        </div>
      )}
    </>
  );
}
