import DetailsHeader from "@/components/blocks/details-header/details-header";
import HorizonalList from "@/components/blocks/horizontal-list/horizontal-list";
import SongList from "@/components/blocks/song-list/song-list";
import { getArtistDetails } from "@/lib/music-api-instance";

type ArtistDetailsPageProps = {
  params: Promise<{
    name: string;
    token: string;
  }>;
};

export default async function ArtistDetailsPage(props: ArtistDetailsPageProps) {
  const params = await props.params;

  const {
    token
  } = params;

  const artist = await getArtistDetails(token);

  return (
    <section className="mb-4 space-y-4">
      <DetailsHeader item={artist} />

      <SongList items={artist.top_songs} />

      <HorizonalList
        title={artist.modules.dedicated_artist_playlist.title}
        items={artist.dedicated_artist_playlist}
      />
      <HorizonalList
        title={artist.modules.featured_artist_playlist.title}
        items={artist.featured_artist_playlist}
      />
      <HorizonalList
        title={artist.modules.top_albums.title}
        items={artist.top_albums}
      />

      <HorizonalList
        title={artist.modules.top_songs.title}
        items={artist.top_songs}
      />

      <HorizonalList
        title={artist.modules.singles.title}
        items={artist.singles}
      />

      <HorizonalList
        title={artist.modules.latest_release.title}
        items={artist.latest_release}
      />
      <HorizonalList
        title={artist.modules.similar_artists.title}
        items={artist.similar_artists}
      />
    </section>
  );
}
