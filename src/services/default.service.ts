import { injectable } from 'inversify';
import logger from '../utils/logger';

@injectable()
class DefaultService {
  // public userModel = UserModel;

  // connect db table
  public async testDatabase(): Promise<Boolean> {
    try {
      // await this.userModel.findAll();
      return true;
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Default Service',
        message: err.stack,
      });
      // throw new HttpException(500, 30001, 'Default');
    }
  }
}

export default DefaultService;
