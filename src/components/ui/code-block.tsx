import "highlight.js/styles/vs2015.css";

import hljs from "highlight.js/lib/core";
import markdown from "highlight.js/lib/languages/markdown";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { cn } from "@/lib/utils";

hljs.registerLanguage("markdown", markdown);

type CodeBlockProps = {
  code: string;
  language?: "markdown" | "plaintext";
  className?: string;
  copyable?: boolean;
};

export function CodeBlock({
  code,
  language = "plaintext",
  className,
  copyable = true,
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const { isCopied, copy } = useCopyClipboard(code);

  useEffect(() => {
    if (!codeRef.current) return;

    hljs.highlightElement(codeRef.current);
  }, [code]);

  return (
    <div
      onClick={copy}
      className={cn(className, "relative pr-12 bg-[#1e1e1e] cursor-pointer")}
    >
      <pre>
        <code
          ref={codeRef}
          className={`language-${language} rounded-md pr-24!`}
        >
          {code}
        </code>
      </pre>
      {copyable && (
        <Button asChild variant="ghost" className="absolute top-0.5 right-0.5">
          <span>
            {isCopied ? (
              <ClipboardCheckIcon size={22} />
            ) : (
              <ClipboardIcon size={22} />
            )}
          </span>
        </Button>
      )}
    </div>
  );
}
