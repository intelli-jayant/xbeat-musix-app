"use client";
import { getUserLibrary, getUserPlaylists } from "@/db/queries";
import { LibraryItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";
import LibraryItemLink from "./LibraryItem";

export const LibraryPage = ({ user }: { user: User }) => {
  const { data: library } = useQuery({
    queryKey: ["library", user?.id],
    queryFn: ({ queryKey }) => getUserLibrary(queryKey[1]!),
  });
  const { data: playlists } = useQuery({
    queryKey: ["user-playlists", user?.id],
    queryFn: ({ queryKey }) => getUserPlaylists(queryKey[1]!),
  });
  const lists: LibraryItem[] = [
    {
      id: "liked-songs",
      name: "Liked Songs",
      songs: library?.songs,
      url: "/u/liked-songs",
      type: "playlist",
      showActions: true,
    },
    ...(playlists || []).map((item) => ({
      ...item,
      type: "playlist",
      url: null,
      showActions: true,
    })),
    ...((library && library.playlists) || []),
    ...((library && library.albums) || []),
    ...((library && library?.artists) || []),
  ];

  return lists.map((item) => (
    <LibraryItemLink key={item.id} data={item} user={user} />
  ));
};
