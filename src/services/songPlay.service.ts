import { injectable } from 'inversify';
import { FindOptions, Transaction } from 'sequelize';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import SongPlays from '../db/models/songPlays.model';
import { SongPlay } from '../types/songPlay.type';

@injectable()
class SongPlayService {
  public songPlays = SongPlays;

  public async findAll(query?: FindOptions): Promise<SongPlay[]> {
    try {
      const resp = await this.songPlays.findAll(query);
      return resp.map((row) => row.toJSON() as SongPlay);
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
    transaction?: Transaction
  ): Promise<SongPlay[]> {
    try {
      const resp = await this.songPlays.bulkCreate(dataToCreate, {
        transaction,
      });
      return resp.map((row) => row.toJSON() as SongPlay);
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
