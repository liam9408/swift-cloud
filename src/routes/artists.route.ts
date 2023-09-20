import { Router } from 'express';
import { Route } from '../types/routes.type';
import { ArtistController } from '../controllers';

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
      // todo: auth middleware goes here
      this.artistController.listArtists
    );
  }
}

export default DefaultRoute;
