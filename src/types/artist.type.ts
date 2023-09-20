import { Song } from './songs.type';

export interface Artist {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  writer?: Song[];
  artist?: Song[];
}

export interface CreateArtistPayload {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
