import { ChevronDownIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BADGE_STYLES,
  buildBadgeUrl,
  contrastLogoColor,
  escapeMarkdownText,
  parseBadgeParams,
  serializeBadgeParams,
  type BadgeConfig,
  type BadgeStyle,
} from "@/lib/badge-url";
import { escapeHtmlAttr } from "@/lib/sanitize";
import { getIcons } from "@/services/simple-icons";
import { CodeBlock } from "./ui/code-block";

const DEFAULT_ICON: SimpleIcon = { title: "GitHub", slug: "github", hex: "181717" };
const HEX_PATTERN = /^[0-9a-fA-F]{6}$/;

interface Props {
  initialSearch?: string;
}

export function BadgeGenerator({ initialSearch = "" }: Props) {
  const [config, setConfig] = useState<BadgeConfig>(() =>
    parseBadgeParams(initialSearch),
  );
  const [simpleIcons, setSimpleIcons] = useState<SimpleIcon[]>([]);
  const [iconsLoading, setIconsLoading] = useState(true);
  const [iconsError, setIconsError] = useState(false);
  const [debouncedConfig] = useDebounce(config, 450);

  const update = (patch: Partial<BadgeConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    const controller = new AbortController();

    async function loadIcons() {
      try {
        const icons = await getIcons(controller.signal);
        if (!controller.signal.aborted) {
          setSimpleIcons(icons);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setIconsError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIconsLoading(false);
        }
      }
    }

    loadIcons();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.search = serializeBadgeParams(debouncedConfig);
    window.history.replaceState({}, "", url);
  }, [debouncedConfig]);

  // Slug from the URL shows as-is until the icon list resolves its title
  const selectedIcon = useMemo<SimpleIcon | null>(() => {
    if (!config.logo) return null;
    return (
      simpleIcons.find((icon) => icon.slug === config.logo) ??
      (config.logo === DEFAULT_ICON.slug
        ? DEFAULT_ICON
        : { title: config.logo, slug: config.logo, hex: "" })
    );
  }, [config.logo, simpleIcons]);

  const handleIconChange = (icon: SimpleIcon | null) => {
    if (icon && HEX_PATTERN.test(icon.hex)) {
      update({
        logo: icon.slug,
        labelColor: `#${icon.hex}`,
        logoColor: contrastLogoColor(icon.hex),
      });
    } else {
      update({ logo: icon?.slug ?? "" });
    }
  };

  const badgeUrl = useMemo(() => buildBadgeUrl(config), [config]);

  const markdownCode = useMemo(
    () => `![${escapeMarkdownText(config.name)}](${badgeUrl})`,
    [config.name, badgeUrl],
  );

  const imgCode = useMemo(
    () =>
      `<img src="${badgeUrl}" alt="${escapeHtmlAttr(`${config.name} badge`)}">`,
    [config.name, badgeUrl],
  );

  return (
    <section className="grid md:grid-cols-2 gap-12">
      <div className="flex flex-col gap-6">
        <Field>
          <FieldLabel htmlFor="badgeName">Badge name</FieldLabel>
          <Input
            id="badgeName"
            onChange={(e) => update({ name: e.target.value })}
            value={config.name}
            autoComplete="off"
            placeholder="Badge name"
          />
        </Field>

        <div
          className={`grid gap-4 ${config.showIcon ? "grid-cols-3" : "grid-cols-2"}`}
        >
          {config.showIcon && (
            <Field>
              <FieldLabel htmlFor="logoColor"> Logo color</FieldLabel>
              <Input
                id="logoColor"
                onChange={(e) => update({ logoColor: e.target.value })}
                value={config.logoColor}
                type="color"
              />
            </Field>
          )}
          <Field>
            <FieldLabel htmlFor="leftColor"> Left color</FieldLabel>
            <Input
              id="leftColor"
              onChange={(e) => update({ labelColor: e.target.value })}
              value={config.labelColor}
              type="color"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="rightColor"> Right color</FieldLabel>
            <Input
              id="rightColor"
              onChange={(e) => update({ color: e.target.value })}
              value={config.color}
              type="color"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="badgeStyle">Style</FieldLabel>
          <Select
            value={config.style}
            onValueChange={(style) => update({ style: style as BadgeStyle })}
          >
            <SelectTrigger id="badgeStyle" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BADGE_STYLES.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="showIcon"
            checked={config.showIcon}
            onCheckedChange={(checked) => update({ showIcon: checked === true })}
          />
          <FieldLabel htmlFor="showIcon">Show icon</FieldLabel>
        </Field>

        {config.showIcon && (
          <Field>
            <FieldLabel>Logo</FieldLabel>
            <Combobox
              items={simpleIcons}
              value={selectedIcon}
              onValueChange={handleIconChange}
              itemToStringLabel={(icon) => icon.title}
              isItemEqualToValue={(icon, value) => icon.slug === value.slug}
              limit={50}
            >
              <ComboboxTrigger
                render={
                  <Button variant="outline" className="w-full justify-between">
                    <ComboboxValue />
                    <ChevronDownIcon className="size-4 opacity-50" />
                  </Button>
                }
              />
              <ComboboxContent>
                <ComboboxInput
                  showTrigger={false}
                  placeholder={
                    iconsLoading
                      ? "Loading icons…"
                      : iconsError
                        ? "Couldn't load icons"
                        : "Search"
                  }
                  disabled={iconsLoading || iconsError}
                />
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.slug} value={item}>
                      {item.title}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        )}
      </div>
      <div className="flex flex-col gap-6 items-center justify-center">
        <img
          src={badgeUrl}
          alt={`${config.name} badge`}
          className="w-auto"
          loading="lazy"
          width="128"
          height="32"
        />

        <CodeBlock code={markdownCode} language="markdown" className="w-full" />
        <CodeBlock code={imgCode} language="html" className="w-full" />
      </div>
    </section>
  );
}
