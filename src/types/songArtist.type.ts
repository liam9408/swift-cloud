export interface SongArtist {
  id?: number;
  artistId?: number;
  songId?: number;
  isMainArtist?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
