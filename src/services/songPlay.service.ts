import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import SongPlays from '../db/models/songPlays.model';
import { Artist } from '../types/artist.type';
import { FindOptions, Transaction } from 'sequelize';

@injectable()
class SongPlayService {
  public songPlays = SongPlays;

  public async findAll(
    query: FindOptions[],
    transaction: Transaction
  ): Promise<Artist[]> {
    try {
      const resp = await this.songPlays.findAll(...query, { transaction });
      return resp.map((row) => row.toJSON() as Artist);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SongPlay Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async batchCreate(
    dataToCreate: any[],
    transaction: Transaction
  ): Promise<Boolean> {
    try {
      await this.songPlays.bulkCreate(dataToCreate, { transaction });
      return true;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'SongPlay Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }
}

export default SongPlayService;
