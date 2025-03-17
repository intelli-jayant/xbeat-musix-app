import { Disc3, Library, ListMusic, Mic2 } from "lucide-react";

import type { LucideIcon } from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  hideOnSidebar?: boolean;
  hideOnNavbar?: boolean;
};

export const sidebarNavDiscoverItems: NavItem[] = [
  {
    title: "Top Albums",
    href: "/album",
    icon: Library,
  },
  {
    title: "Top Charts",
    href: "/chart",
    icon: Disc3,
  },
  {
    title: "Top Playlists",
    href: "/playlist",
    icon: ListMusic,
  },
  // {
  //   title: "Podcasts",
  //   href: "/show",
  //   icon: Podcast,
  // },
  {
    title: "Top Artists",
    href: "/artist",
    icon: Mic2,
  },
];

export const sidebarNavLibraryItems: NavItem[] = [
  // {
  //   title: "Liked Songs",
  //   href: "/u/liked-songs",
  //   icon: Heart,
  //   hideOnNavbar: true,
  // },
  // {
  //   title: "Your Library",
  //   href: "/library",
  //   icon: Library,
  //   hideOnNavbar: true,
  // },

  // {
  //   title: "Albums",
  //   href: "/library/albums",
  //   icon: Album,
  // },
  // {
  //   title: "Artists",
  //   href: "/library/artists",
  //   icon: Mic2,
  // },
  {
    title: "All",
    href: "/library",
    icon: ListMusic,
    hideOnSidebar: true,
  },
  {
    title: "Playlists",
    href: "/library/playlists",
    icon: ListMusic,
    hideOnSidebar: true,
  },
  {
    title: "Albums",
    href: "/library/albums",
    icon: ListMusic,
    hideOnSidebar: true,
  },
  {
    title: "Artists",
    href: "/library/artists",
    icon: ListMusic,
    hideOnSidebar: true,
  },
];
