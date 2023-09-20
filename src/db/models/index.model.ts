import { Sequelize } from 'sequelize';

import { DialectOptions } from '../../types/sequelize.type';

import Songs from './song.model';
import Albums from './album.model';
import AlbumSongs from './albumSong.model';
import Artists from './artist.model';
import SongArtists from './songArtist.model';
import SongWriters from './songWriter.model';
import SongPlays from './songPlays.model';

console.info('Initializing sequelize...');

const sqlInitialize = () => {
  const dialectOptions: DialectOptions = {
    // e.g. socketPath: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
    // same as host string above
    socketPath: process.env.POSTGRES_HOST,
  };

  return new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      logging: false,
      pool: {
        min: 0,
        max: 50,
        idle: 10000,
        acquire: 30000,
      },
      dialectOptions,
    }
  );
};

export const sequelize = sqlInitialize();

export const initModels = async (sequelizeInst: Sequelize) => {
  try {
    console.info('Initializing sequelize models...');
    await Songs.initModel(sequelizeInst);
    await Albums.initModel(sequelizeInst);
    await AlbumSongs.initModel(sequelizeInst);
    await Artists.initModel(sequelizeInst);
    await SongArtists.initModel(sequelizeInst);
    await SongWriters.initModel(sequelizeInst);
    await SongPlays.initModel(sequelizeInst);
  } catch (error) {
    console.log(error);
  }
};

export const initAssociation = async () => {
  try {
    console.info('Initializing sequelize associations...');
    await Songs.initAssociation();
    await Albums.initAssociation();
    await AlbumSongs.initAssociation();
    await Artists.initAssociation();
    await SongArtists.initAssociation();
    await SongWriters.initAssociation();
    await SongPlays.initAssociation();
  } catch (error) {
    console.log(error);
  }
};
