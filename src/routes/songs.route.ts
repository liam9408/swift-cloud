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
      `${this.path}`,
      // todo: authMiddleware goes here
      apiLoggerMiddleware('listSongs'),
      this.songsController.listSongs
    );

    this.router.get(`${this.path}`, this.songsController.listSongs);

    this.router.get(
      `${this.path}/popular/:month`,
      apiLoggerMiddleware('listSongs'),
      this.songsController.listSongs
    );

    this.router.get(
      `${this.path}/:id`,
      apiLoggerMiddleware('listSongs'),
      this.songsController.listSongs
    );

    this.router.get(
      `${this.path}/search/artist/:artistName`,
      apiLoggerMiddleware('listSongs'),
      this.songsController.listSongs
    );

    this.router.get(
      `${this.path}/search`,
      apiLoggerMiddleware('listSongs'),
      this.songsController.listSongs
    );

    this.router.get(
      `${this.path}/songs/top/:limit`,
      apiLoggerMiddleware('listSongs'),
      this.songsController.listSongs
    );
  }
}

export default DefaultRoute;
