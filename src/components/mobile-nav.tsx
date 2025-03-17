"use client";
import { cn } from "@/lib/utils";
import { Home, Library, type LucideIcon, Search, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginDrawerDialog } from "./blocks/auth/login";
import type { User } from "next-auth";

type MobileNavigationProps = {
  user: User | undefined;
};
type MobileNavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  loginRequired?: boolean;
};
const mobileNavItems: MobileNavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Library", icon: Library, href: "/library", loginRequired: true },
  // { label: "Settings", icon: Cog, href: "/settings", loginRequired: true },
];

const MobileNavigation = ({ user }: MobileNavigationProps) => {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden h-14 fixed bottom-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md flex justify-between items-center text-muted-foreground">
      {mobileNavItems.map(({ href, icon: Icon, label, loginRequired }) => {
        const isActive = pathname === href;
        if (loginRequired && !user) return null;
        return (
          <Link
            href={href}
            key={label}
            className={cn(
              "flex justify-center items-center gap-2 w-1/4",
              isActive && "text-secondary-foreground"
            )}
            title={label}
          >
            <Icon className="size-6 sm:size-5" />
            <span className="text-sm sm:inline-block hidden">{label}</span>
          </Link>
        );
      })}
      {!user && (
        <LoginDrawerDialog>
          <button className="flex justify-center items-center gap-2 w-1/4">
            <User2 className="size-6 sm:size-5" />
            <span className="text-sm sm:inline-block hidden">Login</span>
          </button>
        </LoginDrawerDialog>
      )}
    </nav>
  );
};
export default MobileNavigation;
