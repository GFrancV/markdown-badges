import "highlight.js/styles/vs2015.css";

import { hljs } from "@/lib/hljs";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { CopyClipboardButton } from "../copy-clipboard-button";

type CodeBlockProps = {
  code: string;
  language?: "markdown" | "plaintext" | "html" | "json";
  className?: string;
  copyable?: boolean;
};

export function CodeBlock({
  code,
  language = "plaintext",
  className,
  copyable = true,
}: CodeBlockProps) {
  const highlightedCode = useMemo(() => {
    if (!code) return "";

    if (hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }

    return hljs.highlightAuto(code).value;
  }, [code, language]);

  return (
    <div
      className={cn("relative pr-12 bg-[#1e1e1e]  thin-scrollbar", className)}
    >
      <pre>
        <code
          className={`hljs language-${language} block pr-24!`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
      {copyable && (
        <CopyClipboardButton
          content={code}
          className="absolute top-1 right-1"
        />
      )}
    </div>
  );
}
