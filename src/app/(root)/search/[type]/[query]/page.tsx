import { search } from "@/lib/music-api-instance";
import { SearchResults } from "./_components/search-result";
import type { UserPlaylist } from "@/db/schema";
import { getUser } from "@/lib/auth";
import { getUserPlaylists } from "@/db/queries";

type SearchResultPageProps = {
  params: Promise<{
    type: "song" | "album" | "playlist" | "artist" | "show";
    query: string;
  }>;
};

export default async function SearchResultPage({
  params,
}: SearchResultPageProps) {
  const { type, query } = await params;
  const user = await getUser();
  let playlists: UserPlaylist[] | undefined;
  if (!!user) {
    playlists = await getUserPlaylists(user.id!);
  }
  const searchResult = await search(query, type, 1, 50);
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-center">
          <em className="font-bold">
            &quot;{decodeURIComponent(query)}&quot;&nbsp;{type}s
          </em>
        </h2>
      </header>
      <main>
        <SearchResults
          query={query}
          type={type}
          initialSearchResults={searchResult}
          user={user}
          playlists={playlists}
        />
      </main>
    </div>
  );
}
