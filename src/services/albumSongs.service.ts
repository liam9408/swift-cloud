import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import ArtistModel from '../db/models/artist.model';
import { Transaction } from 'sequelize';

@injectable()
class AlbumSongsService {
  public artistModel = ArtistModel;

  public async batchCreate(
    dataToCreate: any[],
    transaction: Transaction
  ): Promise<Boolean> {
    try {
      await this.artistModel.bulkCreate(dataToCreate, { transaction });
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
