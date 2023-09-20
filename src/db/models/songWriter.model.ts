import { Sequelize, Model, DataTypes } from 'sequelize';
import Songs from './song.model';
import Artists from './artist.model';

class SongWriter extends Model {
  public id!: number;

  public songId: number;

  public artistId: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    SongWriter.init(
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
      },
      {
        sequelize,
        modelName: 'songWriters',
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(Songs);
    this.belongsTo(Artists);
  }
}

export default SongWriter;
