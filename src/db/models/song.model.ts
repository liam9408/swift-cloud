import { Sequelize, Model, DataTypes } from 'sequelize';
import { values as getValues } from 'lodash';

import Albums from './album.model';
import AlbumSongs from './albumSong.model';
import Artists from './artist.model';
import SongArtists from './songArtist.model';
import SongWriters from './songWriter.model';
import SongPlays from './songPlays.model';

import { SONGS } from '../../enums';

class Song extends Model {
  public id: number;

  public name: string;

  public type: Enumerator;

  public live: boolean;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Song.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
        },
        type: {
          type: DataTypes.ENUM,
          values: getValues(SONGS.type),
          defaultValue: SONGS.type.ORIGINAL,
        },
        live: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'songs',
      }
    );
  }

  public static initAssociation(): void {
    this.hasMany(SongPlays);
    this.belongsToMany(Albums, {
      through: AlbumSongs,
    });
    this.belongsToMany(Artists, {
      as: 'performers',
      through: SongArtists,
    });
    this.belongsToMany(Artists, {
      as: 'writers',
      through: SongWriters,
    });
  }
}

export default Song;
