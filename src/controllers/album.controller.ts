import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import { AlbumService } from '../services';
import logger from '../utils/logger';

@injectable()
class AlbumController {
  public albumService = iocContainer.get<AlbumService>(
    SERVICE_IDENTIFIER.ALBUM_SERVICE
  );

  public listAlbums = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.albumService.findAll();
      res.status(200).json({ success: true, data: resp });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Album Controller',
        message: `Unable to list album`,
      });
      next(error);
    }
  };
}

export default AlbumController;
