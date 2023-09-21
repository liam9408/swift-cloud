import { injectable } from 'inversify';
import { FindOptions, Transaction } from 'sequelize';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import SongModel from '../db/models/song.model';
import { Song } from '../types/songs.type';

@injectable()
class SongService {
  public songModel = SongModel;

  public async findOne(query?: FindOptions): Promise<Song> {
    try {
      const resp = await this.songModel.findOne(query);
      return resp.toJSON() as Song;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Song Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async findAndCountAll(
    query?: FindOptions
  ): Promise<{ rows: Song[]; count: number }> {
    try {
      const records = await this.songModel.findAndCountAll(query);
      return {
        ...records,
        count: records.count,
        rows: records.rows.map((row: any) => row.toJSON() as Song),
      };
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Song Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async findAll(query?: FindOptions): Promise<Song[]> {
    try {
      const resp = await this.songModel.findAll(query);
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
