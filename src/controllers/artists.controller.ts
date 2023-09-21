import { injectable } from 'inversify';
import { Op, WhereOptions } from 'sequelize';
import { NextFunction, Request, Response } from 'express';

import { omit } from 'lodash';
import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import SongModel from '../db/models/song.model';

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
      const { offset = 0, limit = 50, ...searchValues } = req.query;
      let sort: any = 'desc';
      let sortBy: any = 'createdAt';
      if (req.query) {
        sort = req.query.sort ? req.query.sort : sort;
        sortBy = req.query.sortBy ? req.query.sortBy : sortBy;
      }

      const searchParams = this.buildSearchParams(searchValues);
      const query = {
        where: {
          ...searchParams,
        },
      };

      const rawResp = await this.artistService.findAll(query);
      const resp = rawResp.map((row) => omit(row, 'createdAt', 'updatedAt'));

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

  public getArtist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { artistId } = req.params;

      const query = {
        where: {
          id: artistId,
        },
        include: [
          { model: SongModel, as: 'performers' },
          { model: SongModel, as: 'writers' },
        ],
      };

      const rawResp = await this.artistService.findOne(query);

      const resp = {
        ...rawResp,
        performers: rawResp.performers.map((song) =>
          omit(song, ['songArtists', 'createdAt', 'updatedAt'])
        ),
        writers: rawResp.writers.map((song) =>
          omit(song, ['songWriters', 'createdAt', 'updatedAt'])
        ),
      };

      res.status(200).json({ success: true, data: resp });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Artist Controller',
        message: `Unable to get artist`,
      });
      next(error);
    }
  };

  private buildSearchParams(searchValues: any) {
    const searchParams: WhereOptions = {};

    for (const [searchByKey, searchByValue] of Object.entries(searchValues)) {
      switch (searchByKey) {
        case 'id':
          searchParams.id = String(searchByValue)
            .split(',')
            .map((val) => Number(val));
          break;
        case 'name':
          searchParams.name = {
            [Op.iLike]: `%${searchByValue}%`,
          };
          break;
        default:
      }
    }

    return searchParams;
  }
}

export default ArtistController;
