import DetailsHeader from "@/components/blocks/details-header/details-header";
import HorizonalList from "@/components/blocks/horizontal-list/horizontal-list";
import SongList from "@/components/blocks/song-list/song-list";
import {
  getAlbumDetails,
  getAlbumFromSameYear,
  getAlbumRecommendations,
  getTrending,
} from "@/lib/music-api-instance";
import albumsData from "@/static/albums.json";
type AlbumDetailsPageProps = {
  params: Promise<{ name: string; token: string }>;
};

const loadPageData = async (token: string) => {
  const album = await getAlbumDetails(token);
  // TODO:  fetch recommendations, trending albums, current year's albums
  const [rec, trending, thisYearAlbums] = await Promise.allSettled([
    getAlbumRecommendations(album.id),
    getTrending("album"),
    getAlbumFromSameYear(album.year),
  ]);
  return {
    album,
    recommendations: rec.status === "fulfilled" ? rec.value : [],
    trending: trending.status === "fulfilled" ? trending.value : [],
    thisYearAlbums:
      thisYearAlbums.status === "fulfilled" ? thisYearAlbums.value : [],
  };
};
export default async function AlbumDetailsPage(props: AlbumDetailsPageProps) {
  const params = await props.params;
  const { token } = params;
  const { album, recommendations, trending } = albumsData;
  console.log(albumsData);

  return (
    <section className="mb-4 space-y-4">
      <DetailsHeader item={album} />
      <SongList items={album.songs} showAlbum={false} />
      {recommendations.length > 0 && (
        <HorizonalList
          items={recommendations}
          title={album.modules.recommend.title}
        />
      )}
      {trending.length > 0 && (
        <HorizonalList
          items={trending}
          title={album.modules.currently_trending.title}
        />
      )}
      {/* {thisYearAlbums.length > 0 && (
        <HorizonalList
          items={thisYearAlbums}
          title={album.modules.top_albums_from_same_year.title}
        />
      )} */}

      <HorizonalList
        title={album.modules.artists.title}
        items={album.artist_map.artists}
      />
    </section>
  );
}
