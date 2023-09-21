import { Router } from 'express';
import { Route } from '../types/routes.type';
import { ArtistController } from '../controllers';
import apiLoggerMiddleware from '../middlewares/apiLogger';

class DefaultRoute implements Route {
  public path = '/api/artists';

  public router = Router();

  public artistController = new ArtistController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      apiLoggerMiddleware('listArtists'),
      this.artistController.listArtists
    );

    this.router.get(
      `${this.path}/:artistId`,
      apiLoggerMiddleware('getArtist'),
      this.artistController.getArtist
    );
  }
}

export default DefaultRoute;
