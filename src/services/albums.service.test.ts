/* eslint-disable jest/no-conditional-expect */
import iocTestContainer, {
  setupSequelize,
} from '../tests/configs/jest.ioc.config';
import { SERVICE_IDENTIFIER } from '../constants';
import AlbumService from './albums.service';

import AlbumModel from '../db/models/album.model';

const mockedAlbumModel = AlbumModel as jest.Mocked<any>;

const album = {
  id: 1,
  name: 'test album',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Unit Test: Album Service', () => {
  let albumService: AlbumService;

  beforeAll(async () => {
    await setupSequelize();

    albumService = iocTestContainer.get<AlbumService>(
      SERVICE_IDENTIFIER.ALBUM_SERVICE
    );
  });

  describe('findAndCountAll', () => {
    it('success', async () => {
      jest
        .spyOn(mockedAlbumModel, 'findAndCountAll')
        .mockImplementation(async () => {
          return { rows: [], count: 0 };
        });
      const resp = await albumService.findAndCountAll();
      expect(resp.rows.length).toBeGreaterThanOrEqual(0);
      expect(resp.count).not.toBeNull();
    });

    it('error', async () => {
      jest
        .spyOn(mockedAlbumModel, 'findAndCountAll')
        .mockImplementation(async () => {
          throw new Error();
        });

      try {
        await albumService.findAndCountAll();
      } catch (e) {
        expect(e).toEqual(expect.any(Error));
      }
    });
  });

  describe('findAll', () => {
    it('success', async () => {
      const albumModelInstanceMock = {
        toJSON: jest.fn(() => album),
        map: jest.fn(() => [album]),
      };

      jest
        .spyOn(mockedAlbumModel, 'findAll')
        .mockResolvedValueOnce(albumModelInstanceMock);

      const resp = await albumService.findAll();
      expect(resp.length).toBeGreaterThanOrEqual(0);
    });

    it('error', async () => {
      jest.spyOn(mockedAlbumModel, 'findAll').mockImplementation(async () => {
        throw new Error();
      });
      return albumService
        .findAll()
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('findOne', () => {
    const findOneQuery = {
      where: {
        id: album.id,
      },
    };

    it('success', async () => {
      try {
        const albumModelInstanceMock = {
          ...album,
          toJSON: jest.fn(() => album),
        };

        jest
          .spyOn(mockedAlbumModel, 'findOne')
          .mockResolvedValueOnce(albumModelInstanceMock);

        const resp = await albumService.findOne(findOneQuery);
        expect(albumService.albumModel.findOne).toHaveBeenCalledWith(
          findOneQuery
        );
        expect(resp).not.toBeNull();
        expect(resp).toHaveProperty('id');
      } catch (err) {
        console.log(err);
      }
    });

    it('error', async () => {
      jest.spyOn(mockedAlbumModel, 'findByPk').mockImplementation(async () => {
        throw new Error();
      });
      return albumService
        .findOne(findOneQuery)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('batchCreate', () => {
    it('success', async () => {
      const albumModelInstanceMock = {
        map: jest.fn(() => [album]),
        toJSON: jest.fn(() => album),
      };

      jest
        .spyOn(mockedAlbumModel, 'bulkCreate')
        .mockResolvedValueOnce(albumModelInstanceMock);

      jest.mock('sequelize', () => ({
        transaction: jest.fn(() => Promise.resolve()),
      }));

      const resp = await albumService.batchCreate([album]);

      expect(albumService.albumModel.bulkCreate).toHaveBeenCalledTimes(1);
      expect(resp).not.toBeNull();
      expect(resp.length).toBeGreaterThanOrEqual(0);
    });

    it('error', async () => {
      return albumService
        .batchCreate([album])
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });
});
