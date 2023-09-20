import { Song } from './songs.type';

export interface SongPlay {
  id?: number;
  songId?: number;
  month?: string;
  playCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  song?: Song;
}

export interface CreateSongPlayPayload {
  stringId: number;
  month: string;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}
