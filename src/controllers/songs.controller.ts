import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import { SongService } from '../services';
import logger from '../utils/logger';

@injectable()
class SongController {
  public songService = iocContainer.get<SongService>(
    SERVICE_IDENTIFIER.SONG_SERVICE
  );

  public listSongs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.songService.findAll();

      res.status(200).json({ success: true, data: resp });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Songs Controller',
        message: `Unable to list songs`,
      });
      next(error);
    }
  };
}

export default SongController;
