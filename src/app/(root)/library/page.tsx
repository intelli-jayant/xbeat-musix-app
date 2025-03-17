import { getUser } from "@/lib/auth";
import React from "react";
import { LibraryPage } from "./_components/library-page";

export default async function Page() {
  const user = await getUser();
  // let playlists: UserPlaylist[] | undefined;
  // let library: Library | undefined;
  // if (!!user && !!user.id) {
  //   [playlists, library] = await Promise.all([
  //     getUserPlaylists(user.id),
  //     getUserLibrary(user.id),
  //   ]);
  // }
  if (!user) {
    return null;
  }
  return <LibraryPage user={user} />;
}
