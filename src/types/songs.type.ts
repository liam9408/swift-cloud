import { Album } from './albums.type';

export interface Song {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  album?: Album;
}

export interface CreateSongPayload {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
