import { FindOptions } from 'sequelize';
import { afterEach, describe } from 'node:test';
import AlbumsService from './albums.service'; // Update the import path
import AlbumModel from '../db/models/album.model';

// Mock the dependencies
jest.mock('../db/models/album.model', () => ({
  findAndCountAll: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  bulkCreate: jest.fn(),
}));

const album = {
  id: 1,
  name: 'test album',
  year: '2023',
  createdAt: '',
  updatedAt: '',
};

const albumService = new AlbumsService();

describe('AlbumsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAndCountAll', () => {
    it('should find and count all albums', async () => {
      const query: FindOptions = {}; // Add any necessary query options
      const expectedResult = {
        rows: [album],
        count: 10, // Adjust as needed
      };

      (AlbumModel.findAndCountAll as jest.Mock).mockResolvedValue(
        expectedResult
      );

      const result = await albumService.findAndCountAll(query);

      expect(result).toEqual(expectedResult);
    });

    it('should handle errors and throw HttpException', async () => {
      const query: FindOptions = {}; // Add any necessary query options

      (AlbumModel.findAndCountAll as jest.Mock).mockRejectedValue(
        new Error('Test Error')
      );

      await expect(albumService.findAndCountAll(query)).rejects.toThrow(
        new Error()
      );
    });
  });

  // Add similar test blocks for other methods (findAll, findOne, batchCreate)
});
