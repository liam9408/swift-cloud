import { Album } from './albums.type';
import { Song } from './songs.type';

export interface AlbumSong {
  id?: number;
  albumId?: number;
  songId?: number;
}
