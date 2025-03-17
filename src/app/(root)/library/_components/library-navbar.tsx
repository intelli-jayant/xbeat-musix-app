"use client";
import { sidebarNavLibraryItems } from "@/components/blocks/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LibraryNavbar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2">
      {sidebarNavLibraryItems.map(({ href, title, hideOnNavbar }, idx) => {
        const isActive = pathname === href;
        if (hideOnNavbar) return null;
        return (
          <Link
            key={`library-nav-${href}-${idx}`}
            href={isActive ? "/library" : href}
          >
            <div
              className={cn(
                "flex items-center gap-3 border w-fit px-3 py-1 rounded-full lg:hover:border-primary ",
                isActive
                  ? "bg-primary text-background border-none"
                  : "lg:text-muted-foreground lg:hover:text-primary"
              )}
            >
              <p className="text-sm ">{title}</p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default LibraryNavbar;
