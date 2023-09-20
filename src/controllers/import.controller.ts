import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

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
import { RequestWithFile } from '../types/request.type';

import SongsSchema from '../csvSchema/songs.schema';

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
      const { rows: songList } = await CsvParser.parse(
        fileBuffer,
        csvSchema.def,
        {
          parsedBy: 'NAME',
        }
      );

      res.json({ success: true, data: songList });
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
