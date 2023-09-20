import { injectable } from 'inversify';
import logger from '../utils/logger';
import HttpException from '../exceptions/HttpException';

@injectable()
class DefaultService {
  public userModel = {};

  // connect db table
  public async testDatabase(): Promise<Boolean> {
    try {
      // await this.userModel.findAll();
      console.log(this.userModel);
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
