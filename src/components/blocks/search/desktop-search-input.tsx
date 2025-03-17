import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsTyping } from "@/hooks/atom-hooks";
import useDebounce from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export const DesktopSearchInput = () => {
  const inputeRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(useSearchParams().get("q") || "");
  const q = useDebounce(query, 500);
  const router = useRouter();
  const setIsTyping = useIsTyping()[1];

  useEffect(() => {
    if (!!q) {
      router.push(`/search?q=${q}`);
    } else {
      router.push("/");
    }
  }, [q, router]);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }
        e.preventDefault();
        inputeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <div className="relative">
      <Input
        ref={inputeRef}
        onFocus={() => setIsTyping(true)}
        onBlur={() => setIsTyping(false)}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="What do you want to play?"
        className="px-10 w-72"
        autoComplete="on"
        name="search"
      />

      <Search className="size-5 text-muted-foreground absolute left-2 top-1/2 -translate-y-1/2" />
      {!!query ? (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Button
            size="icon"
            variant="link"
            className="text-muted-foreground hover:text-primary"
            onClick={() => setQuery("")}
          >
            <X className="size-5" />
          </Button>
        </div>
      ) : (
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </div>
  );
};
