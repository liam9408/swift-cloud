import { Router } from 'express';
import { Route } from '../types/routes.type';
import { SongsController } from '../controllers';
import apiLoggerMiddleware from '../middlewares/apiLogger';

class DefaultRoute implements Route {
  public path = '/api/songs';

  public router = Router();

  public songsController = new SongsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/popular/:month`,
      apiLoggerMiddleware('getPopularSongs'),
      this.songsController.getPopularSongs
    );

    this.router.get(
      `${this.path}/:songId`,
      apiLoggerMiddleware('getSong'),
      this.songsController.getSong
    );

    this.router.get(
      `${this.path}`,
      apiLoggerMiddleware('listSongs'),
      this.songsController.listSongs
    );
  }
}

export default DefaultRoute;
