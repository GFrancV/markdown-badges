import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BadgeCard({ badge }: { badge: Badge }) {
  const { name, url, category } = badge;

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`![${name}](${url})`);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 700);

    toast.success("Copied to clipboard");
  };

  return (
    <div
      onClick={handleCopy}
      className="relative group bg-[#1e1e1e] cursor-pointer text-white rounded-sm border border-transparent transition p-6 text-center flex flex-col hover:bg-fuchsia-300/30 hover:border-fuchsia-200 badget-element h-full"
    >
      <h2 className="text-[#f1f1ef] text-lg font-semibold mt-1 mb-3">{name}</h2>
      <img
        src={url}
        alt={`${name} badge`}
        width="100"
        height="28"
        className="mt-auto h-7 w-auto mx-auto mb-4"
        loading="lazy"
      />
      <div className="mt-2">
        <div className="rounded-full border border-neutral-300 px-2 py-1 text-sm text-neutral-300 group-hover:border-fuchsia-300 group-hover:text-fuchsia-300 transition duration-300 w-auto">
          {category}
        </div>
      </div>
      <button className="absolute top-0 right-0 m-2 text-gray-600 transition duration-300 group-hover:text-fuchsia-300 text-xl">
        {!isCopied ? (
          <ClipboardIcon size={22} />
        ) : (
          <ClipboardCheckIcon size={22} />
        )}
      </button>
    </div>
  );
}
