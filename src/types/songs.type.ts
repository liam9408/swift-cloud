import { Artist } from 'artist.type';
import { Album } from './albums.type';

export interface SongImport {
  song: string;
  artist: string;
  writer: string;
  album: string;
  year: string;
  playsJune: number;
  playsJuly: number;
  playsAugust: number;
}

export interface Song {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  album?: Album;
  artist?: Artist[];
  writer?: Artist[];
}

export interface CreateSongPayload {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
