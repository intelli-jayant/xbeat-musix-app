import { getFeaturedPlaylists } from "@/lib/music-api-instance";
import { Lang } from "@/types";
import TopPlaylists from "./_components/top-playlists";
import featuredPlaylist from "../../../static/featuredPlaylist.json"

type TopPlaylistsPageProps = {
  searchParams: Promise<{ page?: number; lang?: Lang }>;
};

export default async function TopPlaylistsPage(props: TopPlaylistsPageProps) {
  const searchParams = await props.searchParams;
  const { lang, page = 1 } = searchParams;
  // const featruedPlaylists = await getFeaturedPlaylists(page, 50, lang);
  const featruedPlaylists = featuredPlaylist.data.data;
  return (
    <section className="mb-4">
      <header className="mb-2">
        <h2 className="font-heading text-xl">Top Playlists</h2>
      </header>

      <TopPlaylists initialPlaylists={featruedPlaylists} />
    </section>
  );
}
