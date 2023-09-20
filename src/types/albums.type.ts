import { Song } from './songs.type';

export interface Album {
  id?: number;
  name?: string;
  year?: string;
  createdAt?: Date;
  updatedAt?: Date;
  songs?: Song[];
}

export interface CreateAlbumPayload {
  name: string;
  year: string;
  createdAt: Date;
  updatedAt: Date;
}
