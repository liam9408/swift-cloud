import { Sequelize, Model, DataTypes } from 'sequelize';
import Songs from './song.model';
import SongWriters from './songWriter.model';
import SongArtists from './songArtist.model';

class Artist extends Model {
  public id!: number;

  public name: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Artist.init(
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
        modelName: 'artists',
      }
    );
  }

  public static initAssociation(): void {
    this.belongsToMany(Songs, {
      as: 'artists',
      through: SongArtists,
    });
    this.belongsToMany(Songs, {
      as: 'writers',
      through: SongWriters,
    });
  }
}

export default Artist;
