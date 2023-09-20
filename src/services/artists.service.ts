import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import ArtistModel from '../db/models/artist.model';
import { Artist } from '../types/artist.type';
import { FindOptions, Transaction } from 'sequelize';

@injectable()
class ArtistService {
  public artistModel = ArtistModel;

  public async findAll(
    query: FindOptions[],
    transaction: Transaction
  ): Promise<Artist[]> {
    try {
      const resp = await this.artistModel.findAll(...query, { transaction });
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
    transaction: Transaction
  ): Promise<Boolean> {
    try {
      await this.artistModel.bulkCreate(dataToCreate, { transaction });
      return true;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Artist Service',
        message: err.stack,
      });
      throw new HttpException(500, 30006, err.message);
    }
  }
}

export default ArtistService;
