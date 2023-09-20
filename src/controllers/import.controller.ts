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
import SongsParser from '../lib/songs.parser';
import removeSpecialCharacters from '../utils/removeSpecialCharacters';
import { RequestWithFile } from '../types/request.type';

import SongsSchema from '../csvSchema/songs.schema';
import { groupBy } from 'lodash';
import { Song, SongImport } from 'songs.type';
import { SONGS } from '../enums';
import { AlbumSong } from 'albumSong.type';
import { Album } from 'albums.type';
import { SongPlay } from 'songPlay.type';
import { SongWriter } from 'songWriter.type';
import { SongArtist } from 'songArtist.type';

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

      // Parse CSV file
      logger.log({
        level: 'info',
        label: 'Import Controller',
        message: `Parsing file: ${file.originalname}...`,
      });
      const { records: songsList } = await SongsParser.parse(file);

      // prepare artists and songdata
      const allArtistsList: string[] = [];
      const allAlbumList: string[] = [];
      const songsToCreate: Song[] = [];

      songsList.forEach((song: SongImport) => {
        const parsedArtistNames = song.artists.map((artist) => {
          const removedFeaturing = artist.name.replace('featuring ', '');
          artist.name = removedFeaturing;
          return artist.name;
        });
        allArtistsList.push(...parsedArtistNames, ...song.writers);

        allAlbumList.push(song.album);

        const songToCreate = {
          name: song.song,
          type: song.type,
          live: song.live,
        };
        songsToCreate.push(songToCreate);
      });

      const uniqueArtistNames = [...new Set(allArtistsList)];
      const artistToCreate = uniqueArtistNames.map((artistName) => ({
        name: artistName,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const groupedByAlbum = groupBy([...songsList], 'album');
      const uniqueAlbumNames = [...new Set(allAlbumList)];
      const albumsToCreate = uniqueAlbumNames.map((albumName) => ({
        name: albumName,
        year: groupedByAlbum[albumName][0].year,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const createArtists = this.artistService.batchCreate(artistToCreate);
      const createAlbums = this.albumService.batchCreate(albumsToCreate);
      const createSongs = this.songService.batchCreate(songsToCreate);
      const [newArtists, newAlbums, newSongs] = await Promise.all([
        createArtists,
        createAlbums,
        createSongs,
      ]);

      const albumSongsToCreate: AlbumSong[] = [];
      const songWritersToCreate: SongWriter[] = [];
      const songArtistsToCreate: SongArtist[] = [];
      const songPlaysToCreate: SongPlay[] = [];

      // process associated data
      for (const [albumName, albumSongs] of Object.entries(groupedByAlbum)) {
        albumSongs.forEach((song) => {
          const songInDb = newSongs.find(
            (newSong) => song.song === newSong.name
          );

          // get album for each song
          const albumSongToCreate = {
            albumId: newAlbums.find((newAlbum) => albumName === newAlbum.name)
              .id,
            songId: songInDb.id,
          };
          albumSongsToCreate.push(albumSongToCreate);

          // get writers for each song
          const songWriterToCreate = song.writers.map((writer: string) => ({
            songId: songInDb.id,
            artistId: newArtists.find((newArtist) => writer === newArtist.name)
              .id,
          }));
          songWritersToCreate.push(...songWriterToCreate);

          // get artist for each song
          const songArtistToCreate = song.artists.map(
            (artist: { name: string; isFeatured: boolean }, index: number) => {
              return {
                songId: songInDb.id,
                artistId: newArtists.find(
                  (newArtist) => artist.name === newArtist.name
                ).id,
                isMainArtist: index === 0,
                isFeatured: artist.isFeatured,
              };
            }
          );
          songArtistsToCreate.push(...songArtistToCreate);

          // get song plays for each song
          const songPlayToCreate = song.plays.map((playData: SongPlay) => ({
            songId: songInDb.id,
            month: playData.month,
            playCount: playData.playCount,
          }));
          songPlaysToCreate.push(...songPlayToCreate);
        });
      }

      const createAlbumSong =
        this.albumSongService.batchCreate(albumSongsToCreate);
      const createSongArtist =
        this.songArtistService.batchCreate(songArtistsToCreate);
      const createSongWriter =
        this.songWriterService.batchCreate(songWritersToCreate);
      const createSongPlay =
        this.albumSongService.batchCreate(albumSongsToCreate);

      const [] = await Promise.all([
        createAlbumSong,
        createSongArtist,
        createSongWriter,
        createSongPlay,
      ]);

      // for (const [albumName, albumSongs] of Object.entries(groupedByAlbum)) {
      //   const albumToCreate = {
      //     name: albumName,
      //     year: albumSongs[0].year,
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //   };
      //   albumsToCreate.push(albumToCreate);
      // }

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
        data: { songWritersToCreate, songArtistsToCreate },
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
