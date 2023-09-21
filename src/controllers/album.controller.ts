import { injectable } from 'inversify';
import { omit } from 'lodash';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import SongModel from '../db/models/song.model';
import ArtistModel from '../db/models/artist.model';

import { getPagination, getOrderOptions } from '../utils/sequelize';
import { AlbumService } from '../services';
import logger from '../utils/logger';
import { Op, WhereOptions } from 'sequelize';
import { Song } from 'songs.type';
import { Artist } from 'artist.type';
import { Album } from 'albums.type';

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
      const { offset = 0, limit = 15, ...searchValues } = req.query;
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
        ...getPagination(limit, offset),
        ...getOrderOptions([{ sortKey: sortBy, sortOrder: sort }]),
        required: true,
        distinct: true,
        include: [
          {
            model: SongModel,
          },
        ],
      };

      const rawResp = await this.albumService.findAndCountAll(query);

      const resp = rawResp.rows.map((row) => ({
        ...omit(row, ['createdAt', 'updatedAt']),
        songs: row.songs.map((song) =>
          omit(song, ['albumSongs', 'createdAt', 'updatedAt'])
        ),
      }));

      res.status(200).json({
        success: true,
        length: rawResp.count,
        rows: resp,
      });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Album Controller',
        message: `Unable to list songs`,
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
        case 'year':
          searchParams.year = String(searchByValue).split(',');
          break;
        default:
      }
    }

    return searchParams;
  }

  private prepareResponse = (song: Song) => {
    function transformArtist(artist: Artist) {
      const { songArtists, ...rest } = omit(artist, ['createdAt', 'updatedAt']);
      return {
        ...rest,
        isFeatured: songArtists.isFeatured,
        isMainArtist: songArtists.isMainArtist,
      };
    }

    // Map and transform the rawResp
    return {
      ...omit(song, ['albumSongs', 'createdAt', 'updatedAt']),
      performers: song.performers.map(transformArtist),
      writers: song.writers.map((writer) =>
        omit(writer, ['songWriters', 'createdAt', 'updatedAt'])
      ),
    };
  };

  public getAlbum = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { albumId } = req.params;

      const query = {
        where: {
          id: albumId,
        },
        include: [
          {
            model: SongModel,
            include: [
              {
                model: ArtistModel,
                as: 'performers',
              },
              {
                model: ArtistModel,
                as: 'writers',
              },
            ],
          },
        ],
      };

      const rawResp = await this.albumService.findOne(query);
      const resp = {
        ...omit(rawResp, ['createdAt', 'updatedAt']),
        songs: rawResp.songs.map((song) => this.prepareResponse(song)),
      };

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
