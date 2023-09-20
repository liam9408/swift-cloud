import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import SongModel from '../db/models/song.model';

@injectable()
class DefaultService {
  public songModel = SongModel;

  // connect db table
  public async testDatabase(): Promise<Boolean> {
    try {
      await this.songModel.findAll();
      return true;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Default Service',
        message: err.stack,
      });
      throw new HttpException(500, 30001, 'Default');
    }
  }
}

export default DefaultService;
