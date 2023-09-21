/* eslint-disable jest/no-conditional-expect */
import iocTestContainer, {
  setupSequelize,
} from '../tests/configs/jest.ioc.config';
import { SERVICE_IDENTIFIER } from '../constants';
import SongService from './songs.service';

import SongModel from '../db/models/song.model';

const mockedSongModel = SongModel as jest.Mocked<any>;

const song = {
  id: 1000,
  name: 'test song',
  type: 'original',
  live: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Unit Test: Artist Service', () => {
  let songService: SongService;

  beforeAll(async () => {
    await setupSequelize();

    songService = iocTestContainer.get<SongService>(
      SERVICE_IDENTIFIER.SONG_SERVICE
    );
  });

  describe('findAll', () => {
    it('success', async () => {
      const artistModelInstanceMock = {
        toJSON: jest.fn(() => song),
        map: jest.fn(() => [song]),
      };

      jest
        .spyOn(mockedSongModel, 'findAll')
        .mockResolvedValueOnce(artistModelInstanceMock);

      const resp = await songService.findAll();
      expect(resp.length).toBeGreaterThanOrEqual(0);
    });

    it('error', async () => {
      jest.spyOn(mockedSongModel, 'findAll').mockImplementation(async () => {
        throw new Error();
      });
      return songService
        .findAll()
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('findOne', () => {
    const findOneQuery = {
      where: {
        id: song.id,
      },
    };

    it('success', async () => {
      try {
        const artistModelInstanceMock = {
          ...song,
          toJSON: jest.fn(() => song),
        };

        jest
          .spyOn(mockedSongModel, 'findOne')
          .mockResolvedValueOnce(artistModelInstanceMock);

        const resp = await songService.findOne(findOneQuery);
        expect(songService.songModel.findOne).toHaveBeenCalledWith(
          findOneQuery
        );
        expect(resp).not.toBeNull();
        expect(resp).toHaveProperty('id');
      } catch (err) {
        console.log(err);
      }
    });

    it('error', async () => {
      jest.spyOn(mockedSongModel, 'findOne').mockImplementation(async () => {
        throw new Error();
      });
      return songService
        .findOne(findOneQuery)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('batchCreate', () => {
    it('success', async () => {
      const artistModelInstanceMock = {
        map: jest.fn(() => [song]),
        toJSON: jest.fn(() => song),
      };

      jest
        .spyOn(mockedSongModel, 'bulkCreate')
        .mockResolvedValueOnce(artistModelInstanceMock);

      jest.mock('sequelize', () => ({
        transaction: jest.fn(() => Promise.resolve()),
      }));

      const resp = await songService.batchCreate([song]);

      expect(songService.songModel.bulkCreate).toHaveBeenCalledTimes(1);
      expect(resp).not.toBeNull();
      expect(resp.length).toBeGreaterThanOrEqual(0);
    });

    it('error', async () => {
      return songService
        .batchCreate([song])
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });
});
