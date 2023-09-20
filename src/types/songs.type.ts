import { Artist } from 'artist.type';
import { Album } from './albums.type';
import { SongPlay } from './songPlay.type';

export interface SongImport {
  song: string;
  artist: string;
  writer: string;
  artists?: { name: string; isFeature: boolean }[];
  writers?: string[];
  album: string;
  year: string;
  type: string;
  live: boolean;
  playsJune: number;
  playsJuly: number;
  playsAugust: number;
  plays?: SongPlay[];
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
