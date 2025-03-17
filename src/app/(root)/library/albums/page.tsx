import { getUserLibrary } from "@/db/queries";
import type { Library } from "@/db/schema";
import { getUser } from "@/lib/auth";
import React from "react";
import LibraryItemLink from "../_components/LibraryItem";

export default async function AlbumsPage() {
  const user = await getUser();
  let library: Library | undefined;
  if (!!user && !!user.id) {
    library = await getUserLibrary(user.id);
  }
  return (library?.albums || []).map((item) => (
    <LibraryItemLink key={item.id} data={item} user={user} />
  ));
}
