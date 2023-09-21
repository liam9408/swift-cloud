import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import AlbumModel from '../db/models/album.model';
import { Album } from '../types/albums.type';
import { FindOptions, Transaction } from 'sequelize';

@injectable()
class AlbumsService {
  public albumModel = AlbumModel;

  public async findAndCountAll(
    query?: FindOptions
  ): Promise<{ rows: Album[]; count: number }> {
    try {
      const records = await this.albumModel.findAndCountAll(query);
      return {
        ...records,
        count: records.count,
        rows: records.rows.map((row: any) => row.toJSON() as Album),
      };
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Album Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async findAll(query?: FindOptions): Promise<Album[]> {
    try {
      const resp = await this.albumModel.findAll({ ...query });
      return resp.map((row) => row.toJSON() as Album);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Album Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async findOne(query?: FindOptions): Promise<Album> {
    try {
      const resp = await this.albumModel.findOne(query);
      return resp.toJSON() as Album;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Album Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async batchCreate(
    dataToCreate: any[],
    transaction?: Transaction
  ): Promise<Album[]> {
    try {
      const resp = await this.albumModel.bulkCreate(dataToCreate, {
        transaction,
      });
      return resp.map((row) => row.toJSON() as Album);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Album Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }
}

export default AlbumsService;
