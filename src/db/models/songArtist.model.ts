import { Sequelize, Model, DataTypes } from 'sequelize';
import Songs from './song.model';
import Albums from './album.model';

class SongArtist extends Model {
  public id!: number;

  public songId: number;

  public artistId: number;

  public feature: true;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    SongArtist.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        songId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'songs',
            key: 'id',
          },
        },
        artistId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'artists',
            key: 'id',
          },
        },
        feature: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'songArtists',
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(Songs);
    this.belongsTo(Albums);
  }
}

export default SongArtist;
