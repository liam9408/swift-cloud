import { Sequelize, Model, DataTypes } from 'sequelize';

import Albums from './album.model';
import AlbumSongs from './albumSong.model';
import Artists from './artist.model';
import SongArtists from './songArtist.model';
import SongWriters from './songWriter.model';
import SongPlays from './songPlays.model';

class Song extends Model {
  public id: number;

  public name: string;

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
      as: 'artist',
      through: SongArtists,
    });
    this.belongsToMany(Artists, {
      as: 'writer',
      through: SongWriters,
    });
  }
}

export default Song;
