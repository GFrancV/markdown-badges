import { ChevronDownIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getIcons } from "@/services/simple-icons";
import { CodeBlock } from "./ui/code-block";

export function BadgeGenerator() {
  const [badgeName, setBadgeName] = useState("GitHub");
  const [logoColor, setLogoColor] = useState("#ffffff");
  const [leftColor, setLeftColor] = useState("#000000");
  const [rightColor, setRightColor] = useState("#000000");
  const [logo, setLogo] = useState<string | null>("github");
  const [simpleIcons, setSimpleIcons] = useState<string[]>([]);
  const [iconsLoading, setIconsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadIcons() {
      try {
        const icons = await getIcons(controller.signal);
        if (!controller.signal.aborted) {
          setSimpleIcons([...new Set(icons.map((icon) => icon.title))]);
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

  const badgeUrl = useMemo(() => {
    return `https://img.shields.io/badge/${badgeName}-1000?style=for-the-badge&logo=${logo}&logoColor=${logoColor.slice(1)}&labelColor=${leftColor.slice(1)}&color=${rightColor.slice(1)}`;
  }, [badgeName, logo, logoColor, leftColor, rightColor]);

  const markdownCode = useMemo(
    () => `![${badgeName}](${badgeUrl})`,
    [badgeName, badgeUrl],
  );

  const imgCode = useMemo(
    () => `<img src="${badgeUrl}" alt="${badgeName} badge">`,
    [badgeName, badgeUrl],
  );

  return (
    <section className="grid md:grid-cols-2 gap-12">
      <div className="flex flex-col gap-6">
        <Field>
          <FieldLabel htmlFor="badgeName">Badge name</FieldLabel>
          <Input
            id="badgeName"
            onChange={(e) => setBadgeName(e.target.value)}
            value={badgeName}
            autoComplete="off"
            placeholder="Badge name"
          />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="logoColor"> Logo color</FieldLabel>
            <Input
              id="logoColor"
              onChange={(e) => setLogoColor(e.target.value)}
              value={logoColor}
              type="color"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="leftColor"> Left color</FieldLabel>
            <Input
              id="leftColor"
              onChange={(e) => setLeftColor(e.target.value)}
              value={leftColor}
              type="color"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="rightColor"> Right color</FieldLabel>
            <Input
              id="rightColor"
              onChange={(e) => setRightColor(e.target.value)}
              value={rightColor}
              type="color"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Logo</FieldLabel>
          <Combobox items={simpleIcons} value={logo} onValueChange={setLogo}>
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
                placeholder={iconsLoading ? "Loading icons…" : "Search"}
                disabled={iconsLoading}
              />
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </div>
      <div className="flex flex-col gap-6 items-center justify-center">
        <img
          src={badgeUrl}
          alt={`${badgeName} badge`}
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
