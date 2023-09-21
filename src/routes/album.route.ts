import { Router } from 'express';
import { Route } from '../types/routes.type';
import { AlbumController } from '../controllers';
import apiLoggerMiddleware from '../middlewares/apiLogger';

class DefaultRoute implements Route {
  public path = '/api/albums';

  public router = Router();

  public albumController = new AlbumController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      apiLoggerMiddleware('listAlbums'),
      // todo: authMiddleware goes here
      this.albumController.listAlbums
    );

    this.router.get(
      `${this.path}/:albumId`,
      apiLoggerMiddleware('getAlbum'),
      this.albumController.getAlbum
    );
  }
}

export default DefaultRoute;
