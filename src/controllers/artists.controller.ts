import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import { ArtistService } from '../services';
import logger from '../utils/logger';

@injectable()
class ArtistController {
  public artistService = iocContainer.get<ArtistService>(
    SERVICE_IDENTIFIER.ARTIST_SERVICE
  );

  public listArtists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.artistService.findAll();
      res.status(200).json({ success: true, data: resp });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Artist Controller',
        message: `Unable to list artists`,
      });
      next(error);
    }
  };
}

export default ArtistController;
