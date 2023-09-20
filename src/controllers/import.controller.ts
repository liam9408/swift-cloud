import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import {
  AlbumService,
  AlbumSongService,
  ArtistService,
  SongArtistService,
  SongPlayService,
  SongService,
  SongWriterService,
} from '../services';
import logger from '../utils/logger';
import CsvParser from '../utils/csvParser';
import removeSpecialCharacters from '../utils/removeSpecialCharacters';
import { RequestWithFile } from '../types/request.type';

import SongsSchema from '../csvSchema/songs.schema';
import { groupBy } from 'lodash';
import { Song, SongImport } from 'songs.type';

@injectable()
class ImportController {
  public albumService = iocContainer.get<AlbumService>(
    SERVICE_IDENTIFIER.ALBUM_SERVICE
  );

  public albumSongService = iocContainer.get<AlbumSongService>(
    SERVICE_IDENTIFIER.ALBUM_SONG_SERVICE
  );

  public artistService = iocContainer.get<ArtistService>(
    SERVICE_IDENTIFIER.ARTIST_SERVICE
  );

  public songArtistService = iocContainer.get<SongArtistService>(
    SERVICE_IDENTIFIER.SONG_ARTIST_SERVICE
  );

  public songPlayService = iocContainer.get<SongPlayService>(
    SERVICE_IDENTIFIER.SONG_PLAY_SERVICE
  );

  public songService = iocContainer.get<SongService>(
    SERVICE_IDENTIFIER.SONG_SERVICE
  );

  public songWriterService = iocContainer.get<SongWriterService>(
    SERVICE_IDENTIFIER.SONG_WRITER_SERVICE
  );

  public batchImportData = async (
    req: RequestWithFile,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [file] = req.files.file;
      const { buffer: fileBuffer } = file;

      const csvSchema = SongsSchema;

      // Parse CSV file
      logger.log({
        level: 'info',
        label: 'Import Controller',
        message: `Parsing file: ${file.originalname}...`,
      });
      const { rows: songsList } = await CsvParser.parse(
        fileBuffer,
        csvSchema.def,
        {
          parsedBy: 'NAME',
        }
      );

      const groupedAlbums = groupBy([...songsList], 'album');

      const albumsToCreate = [];
      for (const [albumName, albumSongs] of Object.entries(groupedAlbums)) {
        const albumToCreate = {
          name: albumName,
          year: albumSongs[0].year,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        albumsToCreate.push(albumToCreate);
      }

      const allArtistsList: string[] = [];
      songsList.map((song: SongImport) => {
        const artists = song.artist
          .split(/\n| and |and |featuring /i)
          .map((artist) => removeSpecialCharacters(artist));
        const writers = song.writer
          .split(/\n| and |and |featuring /i)
          .map((artist) => removeSpecialCharacters(artist));

        const combinedArtists = [...artists, ...writers].filter(
          (artistName) => artistName !== ''
        );

        allArtistsList.push(...combinedArtists);
      });

      const uniqueArtistNames = [...new Set(allArtistsList)];

      const artistToCreate = uniqueArtistNames.map((artistName) => ({
        name: artistName,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const newAlbums = await this.albumService.batchCreate(albumsToCreate);
      const newArtists = await this.artistService.batchCreate(artistToCreate);

      /**
       * create albums
       * create artists, turn into key value pairs
       * create songs
       * create song albums
       * create song artists
       * create song writers
       * create song plays
       */
      res.json({
        success: true,
        data: { albums: newAlbums, artists: newArtists },
        // songsList
      });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Import Controller',
        message: `Unable to import data`,
      });
      next(error);
    }
  };
}

export default ImportController;
