import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import AlbumSongModel from '../db/models/albumSong.model';
import { Transaction } from 'sequelize';

@injectable()
class AlbumSongsService {
  public albumSongModel = AlbumSongModel;

  public async batchCreate(
    dataToCreate: any[],
    transaction?: Transaction
  ): Promise<Boolean> {
    try {
      await this.albumSongModel.bulkCreate(dataToCreate, { transaction });
      return true;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'AlbumSongs Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }
}

export default AlbumSongsService;
