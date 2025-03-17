"use client";

import { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import {
  sidebarNavDiscoverItems,
  // sidebarNavLibraryItems,
} from "./sidebar-nav-items";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSelectedLayoutSegments } from "next/navigation";
import { LoginDrawerDialog } from "@/components/blocks/auth/login";
import type { User } from "next-auth";
// import { ListPlus, Plus } from "lucide-react";
// import { NewPlaylistDialogDrawer } from "../playlist/new-playlist-dialog-drawer";
import { UserPlaylist } from "@/db/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
type SidebarProps = {
  user: User | undefined;
  userPlaylists?: UserPlaylist[];
};
const Sidebar = ({ userPlaylists }: SidebarProps) => {
  const segments = useSelectedLayoutSegments();
  const segment = segments.pop();
  const childSegment = segment || segments.pop();
  return (
    <aside className="hidden lg:block lg:col-span-2 hover:overflow-auto overflow-hidden dark:bg-neutral-900 rounded-md p-3 space-y-3">
      <h4 className="hidden lg:block text-xl font-heading px-3">Discover</h4>
      <nav>
        <ul>
          {sidebarNavDiscoverItems.map(({ title, href, icon: Icon }, idx) => {
            const isActive = href === "/" + (segment ?? "");
            return (
              <li key={idx + "-" + title}>
                <NavLink
                  title={title}
                  href={href}
                  isActive={isActive}
                  className=""
                >
                  <Icon className="size-4 shrink-0" />
                  {title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* {!!user && (
        <>
          <h4 className="hidden lg:block text-xl font-heading px-3">Library</h4>
          <nav>
            <ul>
              {sidebarNavLibraryItems.map(
                ({ title, href, icon: Icon, hideOnSidebar }, idx) => {
                  const isActive = href === "/" + (segment ?? "");
                  if (hideOnSidebar) return null;
                  return (
                    <li key={idx + "-" + title}>
                      <NavLink
                        title={title}
                        href={href}
                        isActive={isActive}
                        className=""
                      >
                        <Icon className="size-4 shrink-0" />
                        {title}
                      </NavLink>
                    </li>
                  );
                }
              )}
            </ul>
          </nav>
        </>
      )} */}
      {/* <div className="flex items-center justify-between">
        <h4 className="hidden lg:block text-xl font-heading px-3">Playlists</h4>
        {!!user && userPlaylists && userPlaylists?.length > 0 && (
          <NewPlaylistDialogDrawer user={user}>
            <Button size="icon" variant="ghost" className="size-7">
              <ListPlus className="size-5" />
            </Button>
          </NewPlaylistDialogDrawer>
        )}
      </div> */}
      {/* {!user ? ( */}
        <LoginDrawerDialog>
          <Button className="w-full">
            <Plus /> Create Playlist
          </Button>
        </LoginDrawerDialog>
      {/* ) : (
        !!user &&
        userPlaylists?.length === 0 && (
          <NewPlaylistDialogDrawer user={user}>
            <Button className="w-full" size="sm">
              <Plus /> Create Playlist
            </Button>
          </NewPlaylistDialogDrawer>
        )
      )} */}
      <ScrollArea>
        <ul>
          {userPlaylists?.map(({ id, name }, idx) => {
            return (
              <li key={idx + "-user-playlist-" + name}>
                <NavLink
                  title={name}
                  href={`/u/playlist/${id}`}
                  isActive={id === childSegment}
                >
                  {name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </aside>
  );
};
export default Sidebar;

type NavLinkProps = {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<"a">;
const NavLink = ({
  href,
  isActive,
  className,
  children,
  ...props
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ size: "sm", variant: "ghost" }),
        "sm:p-0 lg:px-3 justify-center lg:justify-start items-center flex gap-2 text-muted-foreground",
        isActive && "bg-secondary font-semibold text-secondary-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
