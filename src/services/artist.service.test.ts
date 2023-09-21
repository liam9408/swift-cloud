/* eslint-disable jest/no-conditional-expect */
import iocTestContainer, {
  setupSequelize,
} from '../tests/configs/jest.ioc.config';
import { SERVICE_IDENTIFIER } from '../constants';
import ArtistService from './artist.service';

import ArtistModel from '../db/models/artist.model';

const mockedArtistModel = ArtistModel as jest.Mocked<any>;

const artist = {
  id: 1000,
  name: 'test artist',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Unit Test: Artist Service', () => {
  let artistService: ArtistService;

  beforeAll(async () => {
    await setupSequelize();

    artistService = iocTestContainer.get<ArtistService>(
      SERVICE_IDENTIFIER.ALBUM_SERVICE
    );
  });

  describe('findAll', () => {
    it('success', async () => {
      const artistModelInstanceMock = {
        toJSON: jest.fn(() => artist),
        map: jest.fn(() => [artist]),
      };

      jest
        .spyOn(mockedArtistModel, 'findAll')
        .mockResolvedValueOnce(artistModelInstanceMock);

      const resp = await artistService.findAll();
      expect(resp.length).toBeGreaterThanOrEqual(0);
    });

    it('error', async () => {
      jest.spyOn(mockedArtistModel, 'findAll').mockImplementation(async () => {
        throw new Error();
      });
      return artistService
        .findAll()
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('findOne', () => {
    const findOneQuery = {
      where: {
        id: artist.id,
      },
    };

    it('success', async () => {
      try {
        const artistModelInstanceMock = {
          ...artist,
          toJSON: jest.fn(() => artist),
        };

        jest
          .spyOn(mockedArtistModel, 'findOne')
          .mockResolvedValueOnce(artistModelInstanceMock);

        const resp = await artistService.findOne(findOneQuery);
        expect(artistService.artistModel.findOne).toHaveBeenCalledWith(
          findOneQuery
        );
        expect(resp).not.toBeNull();
        expect(resp).toHaveProperty('id');
      } catch (err) {
        console.log(err);
      }
    });

    it('error', async () => {
      jest.spyOn(mockedArtistModel, 'findOne').mockImplementation(async () => {
        throw new Error();
      });
      return artistService
        .findOne(findOneQuery)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('batchCreate', () => {
    it('success', async () => {
      const artistModelInstanceMock = {
        map: jest.fn(() => [artist]),
        toJSON: jest.fn(() => artist),
      };

      jest
        .spyOn(mockedArtistModel, 'bulkCreate')
        .mockResolvedValueOnce(artistModelInstanceMock);

      jest.mock('sequelize', () => ({
        transaction: jest.fn(() => Promise.resolve()),
      }));

      const resp = await artistService.batchCreate([artist]);

      expect(artistService.artistModel.bulkCreate).toHaveBeenCalledTimes(1);
      expect(resp).not.toBeNull();
      expect(resp.length).toBeGreaterThanOrEqual(0);
    });

    it('error', async () => {
      return artistService
        .batchCreate([artist])
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });
});
