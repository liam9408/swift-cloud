import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import SongArtist from '../db/models/songArtist.model';
import { Transaction } from 'sequelize';

@injectable()
class SongArtistService {
  public songArtist = SongArtist;

  public async batchCreate(
    dataToCreate: any[],
    transaction: Transaction
  ): Promise<Boolean> {
    try {
      await this.songArtist.bulkCreate(dataToCreate, { transaction });
      return true;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SongArtist Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }
}

export default SongArtistService;
