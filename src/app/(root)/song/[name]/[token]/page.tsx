import DetailsHeader from "@/components/blocks/details-header/details-header";
import HorizonalList from "@/components/blocks/horizontal-list/horizontal-list";
import SongList from "@/components/blocks/song-list/song-list";
import {
  getAlbumDetails,
  getArtistTopSongs,
  getSongDetails,
  getSongRecommendations,
  getTrending,
} from "@/lib/music-api-instance";

type SongDetailsPageProps = {
  params: Promise<{
    name: string;
    token: string;
  }>;
};

const loadPageData = async (token: string) => {
  const songDetails = await getSongDetails(token);
  const song = songDetails.songs[0];
  const modules = songDetails.modules!;
  const artistsTopSongParams = modules.songs_by_same_artists.params;
  const [album, trending, recommendations, songFromSameArtists] =
    await Promise.all([
      getAlbumDetails(song.album_url.split("/").pop()!),
      getTrending("song"),
      getSongRecommendations(song.id),
      getArtistTopSongs(
        artistsTopSongParams.artist_id,
        artistsTopSongParams.song_id,
        artistsTopSongParams.lang
      ),
    ]);

  return {
    song,
    otherSongsOfSameAlbum: album.songs.filter((s) => s.id !== song.id),
    trending,
    modules,
    recommendations,
    songFromSameArtists,
  };
};
export default async function SongDetailsPage(props: SongDetailsPageProps) {
  const params = await props.params;
  const { token } = params;
  const {
    song,
    otherSongsOfSameAlbum,
    trending,
    modules,
    recommendations,
    songFromSameArtists,
  } = await loadPageData(token);
  return (
    <section className="mb-4 space-y-4">
      <DetailsHeader item={song} />
      {otherSongsOfSameAlbum.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-xl mb-4">
            More from&nbsp;{song.album}
          </h2>
          <SongList items={otherSongsOfSameAlbum} />
        </div>
      )}

      {trending.length > 0 && (
        <HorizonalList
          items={trending}
          title={modules.currently_trending.title}
        />
      )}
      {recommendations.length > 0 && (
        <HorizonalList
          items={recommendations}
          title={modules.recommend.title}
        />
      )}
      {songFromSameArtists.length > 0 && (
        <HorizonalList
          items={songFromSameArtists}
          title={modules.songs_by_same_artists.title}
        />
      )}
      {songFromSameArtists.length > 0 && (
        <HorizonalList
          items={song.artist_map.artists}
          title={modules.artists.title}
        />
      )}
    </section>
  );
}
