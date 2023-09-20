import { Sequelize, Model, DataTypes } from 'sequelize';
import Songs from './song.model';
import AlbumSongs from './albumSong.model';

class Album extends Model {
  public id!: number;

  public name: string;

  public year: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Album.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
        },
        year: {
          type: DataTypes.STRING(4),
        },
      },
      {
        sequelize,
        modelName: 'albums',
      }
    );
  }

  public static initAssociation(): void {
    this.belongsToMany(Songs, {
      through: AlbumSongs,
    });
  }
}

export default Album;
