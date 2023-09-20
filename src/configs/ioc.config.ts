/* IoC Container */
import 'reflect-metadata';
import { Container } from 'inversify';

import { SERVICE_IDENTIFIER } from '../constants';
import ServerConfig from './server.config';

import {
  DefaultService,
  AlbumService,
  AlbumSongService,
  ArtistService,
  SongArtistService,
  SongPlayService,
  SongService,
  SongWriterService,
} from '../services';

const container = new Container();

container
  .bind<ServerConfig>(SERVICE_IDENTIFIER.SERVER_CONFIG)
  .to(ServerConfig)
  .inSingletonScope();

container
  .bind<DefaultService>(SERVICE_IDENTIFIER.DEFAULT_SERVICE)
  .to(DefaultService);

container.bind<AlbumService>(SERVICE_IDENTIFIER.ALBUM_SERVICE).to(AlbumService);

container
  .bind<AlbumSongService>(SERVICE_IDENTIFIER.ALBUM_SONG_SERVICE)
  .to(AlbumSongService);

container
  .bind<ArtistService>(SERVICE_IDENTIFIER.DEFAULT_SERVICE)
  .to(ArtistService);

container
  .bind<SongArtistService>(SERVICE_IDENTIFIER.DEFAULT_SERVICE)
  .to(SongArtistService);

container
  .bind<SongPlayService>(SERVICE_IDENTIFIER.DEFAULT_SERVICE)
  .to(SongPlayService);

container.bind<SongService>(SERVICE_IDENTIFIER.DEFAULT_SERVICE).to(SongService);

container
  .bind<SongWriterService>(SERVICE_IDENTIFIER.DEFAULT_SERVICE)
  .to(SongWriterService);

export default container;
