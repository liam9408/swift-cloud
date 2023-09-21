import { Song } from './songs.type';
import { SongArtist } from 'songArtist.type';
import { SongWriter } from 'songWriter.type';

export interface Artist {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  writer?: Song[];
  artist?: Song[];
  songArtists?: SongArtist;
  songWriters?: SongWriter;
}

export interface CreateArtistPayload {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
