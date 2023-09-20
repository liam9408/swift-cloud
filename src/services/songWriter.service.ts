import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import SongWriter from '../db/models/songWriter.model';

import { Transaction } from 'sequelize';

@injectable()
class SongWriterService {
  public songWriter = SongWriter;

  public async batchCreate(
    dataToCreate: any[],
    transaction?: Transaction
  ): Promise<Boolean> {
    try {
      await this.songWriter.bulkCreate(dataToCreate, {
        transaction,
      });
      return true;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SongWriter Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }
}

export default SongWriterService;
