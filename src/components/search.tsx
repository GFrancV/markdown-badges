import {
  ChevronDownIcon,
  ChevronsDownIcon,
  ClipboardIcon,
  CommandIcon,
  ExternalLinkIcon,
  SearchIcon,
  ShieldIcon,
  ShieldOffIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { BadgesList } from "@/components/badges/badges-list";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Typography } from "@/components/ui/typography";
import { SelectionProvider, useSelection } from "@/context/selection-context";
import { cn } from "@/lib/utils";
import { filterBadges, getBadgeCategories, getBadges } from "@/services/badges";

type SearchProps = {
  initialQuery?: string | null;
  initialCategory?: string | null;
};

export function Search(props: SearchProps) {
  return (
    <SelectionProvider>
      <SearchContent {...props} />
    </SelectionProvider>
  );
}

function SearchContent({
  initialQuery = null,
  initialCategory = null,
}: SearchProps) {
  const { count, clearAll, copyAll, badges: selectedBadges } = useSelection();

  const badges = useMemo(() => getBadges(), []);
  const categories = useMemo(() => getBadgeCategories(), []);

  const searchInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string | null>(initialQuery);
  const [categoryQuery, setCategoryQuery] = useState<string | null>(
    initialCategory,
  );
  const [resultsAmount, setResultsAmount] = useState(30);
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

    if (debouncedQuery && debouncedQuery.length > 0)
      url.searchParams.set("query", debouncedQuery);
    else url.searchParams.delete("query");

    if (categoryQuery) url.searchParams.set("category", categoryQuery);
    else url.searchParams.delete("category");

    window.history.replaceState({}, "", url);
    window.dispatchEvent(new Event("locationchange"));
    setResultsAmount(30);
  }, [debouncedQuery, categoryQuery, isReady]);

  useEffect(() => {
    if (!categories.includes(initialCategory || "")) setCategoryQuery(null);

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
    setResultsAmount((prev) => prev + 30);
  };

  const handleClearQuery = () => {
    setQuery("");
  };

  const isFiltered = (query && query.length > 0) || !!categoryQuery;

  return (
    <>
      <div className="flex md:flex-row flex-col gap-2 mb-6">
        <Field className="flex-1">
          <FieldLabel htmlFor="badge-search" className="sr-only">
            Search Badges
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="badge-search"
              ref={searchInput}
              type="text"
              name="query"
              autoComplete="off"
              value={query ?? undefined}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search badges..."
            />
            <InputGroupAddon>
              <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {!query || query.length === 0 ? (
                <Kbd>
                  {navigator?.platform?.includes("Mac")
                    ? `${(<CommandIcon />)} `
                    : "Ctrl "}
                  K
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
        </Field>

        <Combobox
          items={categories}
          value={categoryQuery}
          onValueChange={setCategoryQuery}
          defaultValue={null}
        >
          <ComboboxTrigger
            render={
              <Button
                variant="outline"
                className="w-50 justify-between text-muted-foreground"
                aria-label="Select category"
              >
                <ComboboxValue placeholder="All Categories" />
                <ChevronDownIcon className="size-4 opacity-50" />
              </Button>
            }
          />
          <ComboboxContent>
            <ComboboxInput
              showTrigger={false}
              showClear
              placeholder="Search category..."
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

      <div className="flex items-center justify-end gap-2 mb-3">
        <div>
          {isFiltered ? (
            <Typography
              as="span"
              size="sm"
              variant="muted"
              className="flex items-center gap-1"
            >
              <SearchIcon /> {filteredBadges.length} result
              {filteredBadges.length !== 1 ? "s" : ""}
            </Typography>
          ) : (
            <Typography
              as="span"
              size="sm"
              variant="muted"
              className="flex items-center gap-1"
            >
              <ShieldIcon /> {badges.length} badges
            </Typography>
          )}
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200 flex items-center justify-between gap-3 mb-4",
          count > 0 ? "h-9" : "h-0",
        )}
      >
        <div className="flex items-center gap-2">
          <Typography
            as="span"
            size="sm"
            variant="primary"
            className="shrink-0"
          >
            {count} badge{count > 1 ? "s" : ""} selected
          </Typography>
          {selectedBadges.length > 0 && (
            <div className="items-center text-sm text-muted-foreground md:flex hidden">
              (
              <Typography
                as="span"
                size="sm"
                variant="muted"
                className="block xl:max-w-lg lg:max-w-xs max-w-46 truncate"
              >
                {selectedBadges.map((b) => b.name).join(", ")}
              </Typography>
              )
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={copyAll}>
            <ClipboardIcon />
            Copy selected
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <XIcon /> Clear selection
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <BadgesList badges={results} selectable />

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
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldOffIcon />
            </EmptyMedia>
            <EmptyTitle>No badges found</EmptyTitle>
            <EmptyDescription>No badges found for "{query}"</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button asChild>
              <a
                href="https://github.com/gfrancv/markdown-badges/issues/new?labels=request&title=%5BRequest%5D%3A"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon />
                Request Badge
              </a>
            </Button>
            <Button variant="secondary" onClick={handleClearQuery}>
              Clear search
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </>
  );
}
