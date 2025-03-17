import DetailsHeader from "@/components/blocks/details-header/details-header";
import HorizonalList from "@/components/blocks/horizontal-list/horizontal-list";
import SongList from "@/components/blocks/song-list/song-list";
import {
  getPlaylistDetails,
  getPlaylistRecommendations,
  getTrending,
} from "@/lib/music-api-instance";
import React from "react";

type PlaylistDetailsPageProps = {
  params: Promise<{
    name: string;
    token: string;
  }>;
};

const loadPageData = async (token: string) => {
  const playlist = await getPlaylistDetails(token);
  const [rec, trending] = await Promise.allSettled([
    getPlaylistRecommendations(playlist.id),
    getTrending("playlist"),
  ]);

  return {
    playlist,
    recommendations: rec.status === "fulfilled" ? rec.value : [],
    trending: trending.status === "fulfilled" ? trending.value : [],
  };
};
export default async function PlaylistDetailsPage(props: PlaylistDetailsPageProps) {
  const params = await props.params;
  const { token } = params;
  const { playlist, recommendations, trending } = await loadPageData(token);
  return (
    <section className="mb-4 space-y-4">
      <DetailsHeader item={playlist} />
      <SongList items={playlist.songs!} />

      {recommendations.length > 0 && (
        <HorizonalList
          items={recommendations}
          title={playlist?.modules?.related_playlist?.title ?? "Recommened"}
        />
      )}
      {trending.length > 0 && (
        <HorizonalList
          items={trending}
          title={
            playlist.modules?.currently_trending_playlists.title ?? "Trending"
          }
        />
      )}

      {playlist.artists && playlist?.artists?.length > 0 && (
        <HorizonalList
          title={playlist.modules?.artists?.title ?? "Artists"}
          items={playlist.artists}
        />
      )}
    </section>
  );
}
