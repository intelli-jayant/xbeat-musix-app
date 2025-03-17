import { getUserLibrary, getUserPlaylists } from "@/db/queries";
import type { Library, UserPlaylist } from "@/db/schema";
import { getUser } from "@/lib/auth";
import React from "react";
import LibraryItemLink from "../_components/LibraryItem";

export default async function PlaylistsPage() {
  const user = await getUser();
  let playlists: UserPlaylist[] | undefined;
  let library: Library | undefined;
  if (!!user && !!user.id) {
    [playlists, library] = await Promise.all([
      getUserPlaylists(user.id),
      getUserLibrary(user.id),
    ]);
  }

  const list = [
    ...(playlists || []).map((item) => ({
      ...item,
      type: "playlist",
      url: null,
      showActions: true,
    })),
    ...((library && library.playlists) || []),
  ];
  return list?.map((item) => (
    <LibraryItemLink key={item.id} data={item} user={user} />
  ));
}
