import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import SongModel from '../db/models/song.model';
import { Song } from '../types/songs.type';
import { FindOptions, Transaction } from 'sequelize';

@injectable()
class SongService {
  public songModel = SongModel;

  public async findAll(query?: FindOptions): Promise<Song[]> {
    try {
      const resp = await this.songModel.findAll({
        ...query,
      });
      return resp.map((row) => row.toJSON() as Song);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Song Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  // connect db table
  public async batchCreate(
    dataToCreate: any[],
    transaction?: Transaction
  ): Promise<Song[]> {
    try {
      const resp = await this.songModel.bulkCreate(dataToCreate, {
        transaction,
      });
      return resp.map((row) => row.toJSON() as Song);
    } catch (err) {
      console.log(err);
      logger.log({
        level: 'error',
        label: 'Song Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }
}

export default SongService;
