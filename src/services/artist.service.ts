import { injectable } from 'inversify';
import { FindOptions, Transaction } from 'sequelize';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import ArtistModel from '../db/models/artist.model';
import { Artist } from '../types/artist.type';

@injectable()
class ArtistService {
  public artistModel = ArtistModel;

  public async findOne(query?: FindOptions): Promise<Artist> {
    try {
      const resp = await this.artistModel.findOne(query);
      return resp.toJSON() as Artist;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Artist Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async findAll(query?: FindOptions): Promise<Artist[]> {
    try {
      const resp = await this.artistModel.findAll(query);
      return resp.map((row) => row.toJSON() as Artist);
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Artist Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }

  public async batchCreate(
    dataToCreate: any[],
    transaction?: Transaction
  ): Promise<Artist[]> {
    try {
      const resp = await this.artistModel.bulkCreate(dataToCreate, {
        transaction,
      });
      return resp;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Artist Service',
        message: err,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }
}

export default ArtistService;
