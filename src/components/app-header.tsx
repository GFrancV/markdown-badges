import { GithubIcon } from "lucide-react";

import { AppLogo } from "./app-logo";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  return (
    <header className="flex justify-between items-center h-12 py-2 px-6 border-b sticky top-0 w-full z-1000 bg-background">
      <div className="md:hidden flex items-center gap-2">
        <SidebarTrigger />
        <AppLogo />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button asChild variant="outline" size="sm">
          <a
            href="https://github.com/GFrancV/markdown-badges"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="w-6 " />
            View Repo
          </a>
        </Button>
      </div>
    </header>
  );
}
