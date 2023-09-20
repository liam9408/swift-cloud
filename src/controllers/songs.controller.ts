import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import { DefaultService } from '../services';
import logger from '../utils/logger';

@injectable()
class DefaultController {
  public defaultService: DefaultService;

  constructor(
    defaultService = iocContainer.get<DefaultService>(
      SERVICE_IDENTIFIER.DEFAULT_SERVICE
    )
  ) {
    this.defaultService = defaultService;
  }

  public testDatabase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.defaultService.testDatabase();
      if (resp) {
        res
          .status(200)
          .json({ success: true, msg: 'Connected to db successfully' });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Default Controller',
        message: `Unable to test database`,
      });
      next(error);
    }
  };
}

export default DefaultController;
