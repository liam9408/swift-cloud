import { injectable } from 'inversify';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import AlbumModel from '../db/models/album.model';
import ArtistModel from '../db/models/artist.model';
import SongPlayModel from '../db/models/songPlays.model';

import { AlbumService, ArtistService, SongService } from '../services';
import logger from '../utils/logger';
import { getPagination, getOrderOptions } from '../utils/sequelize';
import { omit } from 'lodash';
import { Artist } from 'artist.type';
import { Album } from 'albums.type';

@injectable()
class SongController {
  public songService = iocContainer.get<SongService>(
    SERVICE_IDENTIFIER.SONG_SERVICE
  );

  public artistService = iocContainer.get<ArtistService>(
    SERVICE_IDENTIFIER.ARTIST_SERVICE
  );

  public albumService = iocContainer.get<AlbumService>(
    SERVICE_IDENTIFIER.ALBUM_SERVICE
  );

  public listSongs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        offset = 0,
        limit = 15,
        artist,
        writer,
        album,
        year,
        albumName,
        ...searchValues
      } = req.query;
      let sort: any = 'desc';
      let sortBy: any = 'createdAt';
      if (req.query) {
        sort = req.query.sort ? req.query.sort : sort;
        sortBy = req.query.sortBy ? req.query.sortBy : sortBy;
      }

      const searchParams = this.buildSearchParams(searchValues);
      const { artistQuery, writerQuery } = this.buildArtistWriterQueries(
        artist,
        writer
      );
      const albumQuery = this.buildAlbumQueries(albumName, album, year);

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
            model: AlbumModel,
            where: { ...albumQuery },
            required: true,
          },
          {
            model: ArtistModel,
            as: 'artists',
            where: { ...artistQuery },
            required: true,
          },
          {
            model: ArtistModel,
            as: 'writers',
            where: { ...writerQuery },
            required: true,
          },
          {
            model: SongPlayModel,
          },
        ],
      };

      const rawResp = await this.songService.findAndCountAll(query);

      function transformArtist(artist: Artist) {
        const { songArtists, ...rest } = omit(artist, [
          'createdAt',
          'updatedAt',
        ]);
        return {
          ...rest,
          isFeatured: songArtists.isFeatured,
          isMainArtist: songArtists.isMainArtist,
        };
      }
      function transformAlbum(album: Album) {
        const { albumSongs, ...rest } = omit(album, ['createdAt', 'updatedAt']);
        return rest;
      }

      // Map and transform the rawResp
      const resp = rawResp.rows.map((song) => ({
        ...song,
        artists: song.artists.map(transformArtist),
        writers: song.writers.map((writer) =>
          omit(writer, ['songWriters', 'createdAt', 'updatedAt'])
        ),
        albums: song.albums.map(transformAlbum),
        songPlays: song.songPlays.map((playData) =>
          omit(playData, ['createdAt', 'updatedAt'])
        ),
      }));

      res.status(200).json({
        success: true,
        length: rawResp.count,
        realLength: resp.length,
        rows: resp,
      });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Songs Controller',
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
        case 'live':
          searchParams.live = Boolean(searchByValue);
          break;
        case 'type':
          searchParams.type = {
            [Op.in]: String(searchByValue).split(','),
          };
          break;
        default:
      }
    }

    return searchParams;
  }

  private buildAlbumQueries(albumNames: any, albums: any, years: any) {
    let where: WhereOptions = {};

    if (albums) {
      where.id = String(albums)
        .split(',')
        .map((id) => Number(id));
    }

    if (albumNames) {
      where.name = String(albumNames).split(',');
    }

    if (years) {
      where.year = String(years).split(',');
    }

    return where;
  }

  private buildArtistWriterQueries(artist: string | any, writer: string | any) {
    let artistQuery;
    let writerQuery;

    if (artist) {
      artistQuery = {
        where: {
          [Op.and]: [
            Sequelize.literal(
              `EXISTS (
                  SELECT 1 FROM "songArtists"
                  WHERE "songs"."id" = "songArtists"."songId" AND "songArtists"."artistId" IN (${String(
                    artist
                  ).split(',')})
                )`
            ),
          ],
        },
      };
    }

    if (writer) {
      writerQuery = {
        where: {
          [Op.and]: [
            Sequelize.literal(
              `EXISTS (
                  SELECT 1 FROM "songWriters"
                  WHERE "songs"."id" = "songWriters"."songId" AND "songWriters"."artistId" IN (${String(
                    artist
                  ).split(',')})
                )`
            ),
          ],
        },
      };
    }

    return { artistQuery, writerQuery };
  }

  public getPopularSongs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        limit = 15,
        artist,
        writer,
        album,
        year,
        albumName,
        ...searchValues
      } = req.query;
      let sort: any = 'desc';
      let sortBy: any = 'createdAt';
      if (req.query) {
        sort = req.query.sort ? req.query.sort : sort;
        sortBy = req.query.sortBy ? req.query.sortBy : sortBy;
      }

      res.status(200).json({ success: true, data: {} });
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
