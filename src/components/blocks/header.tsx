"use client";
import React from "react";
import type { User } from "next-auth";
import UserAvatarMenu from "./auth/user-avatar-menu";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { useRouter } from "next/navigation";
import Link from "next/link";

// import { useMediaQuery } from "usehooks-ts";
// import { DesktopSearchInput } from "./search/desktop-search-input";

type HeaderProps = {
  user: User | undefined;
};
const Header = ({ user }: HeaderProps) => {
  // const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const router = useRouter();
  return (
    <header className="h-14 flex justify-between items-center p-3 lg:pb-0 shadow-sm">
      <Link href="/" className="text-xl font-heading">
        xbeats
      </Link>
      {/* {isLargeScreen && <DesktopSearchInput />} */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full size-8 hidden lg:flex"
          onClick={() => router.push("/search")}
        >
          <Search size={18} />
        </Button>
        <ThemeToggle />
        <UserAvatarMenu user={user} />
      </div>
    </header>
  );
};

export default Header;
