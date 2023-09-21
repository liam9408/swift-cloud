/* IoC Container */
import 'reflect-metadata';
import { Sequelize } from 'sequelize';
import { Container } from 'inversify';

import { SERVICE_IDENTIFIER } from '../../constants';
import ServerConfig from '../../configs/server.config';

import {
  sequelize,
  initModels,
  initAssociation,
} from '../../db/models/index.model';

import { AlbumService, SongService, ArtistService } from '../../services';

const container = new Container();

export const setupSequelize = async (): Promise<Sequelize> => {
  await initModels(sequelize);
  await initAssociation();
  return sequelize;
};

container.bind<AlbumService>(SERVICE_IDENTIFIER.ALBUM_SERVICE).to(AlbumService);

container.bind<SongService>(SERVICE_IDENTIFIER.SONG_SERVICE).to(SongService);

container
  .bind<ArtistService>(SERVICE_IDENTIFIER.ARTIST_SERVICE)
  .to(ArtistService);

export default container;
