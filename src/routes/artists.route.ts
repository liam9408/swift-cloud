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
      // todo: auth middleware goes here
      this.artistController.listArtists
    );
  }
}

export default DefaultRoute;
