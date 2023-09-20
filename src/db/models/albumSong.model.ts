import { Sequelize, Model, DataTypes } from 'sequelize';
import Songs from './song.model';
import Albums from './album.model';

class AlbumSong extends Model {
  public id!: number;

  public albumId: number;

  public songId: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    AlbumSong.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        albumId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'albums',
            key: 'id',
          },
        },
        songId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'songs',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        modelName: 'albumSongs',
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(Songs);
    this.belongsTo(Albums);
  }
}

export default AlbumSong;
