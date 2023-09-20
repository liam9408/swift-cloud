import { Sequelize, Model, DataTypes } from 'sequelize';
import Songs from './song.model';

class SongPlays extends Model {
  public id!: number;

  public songId: number;

  public month: string;

  public playCount: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    SongPlays.init(
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
        month: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        playCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'songPlays',
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(Songs);
  }
}

export default SongPlays;
