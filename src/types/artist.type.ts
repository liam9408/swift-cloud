import { SongArtist } from './songArtist.type';
import { SongWriter } from './songWriter.type';
import { Song } from './songs.type';

export interface Artist {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  writer?: Song[];
  artist?: Song[];
  writers?: Song[];
  performers?: Song[];
  songArtists?: SongArtist;
  songWriters?: SongWriter;
}

export interface CreateArtistPayload {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
