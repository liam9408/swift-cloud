import { Router } from 'express';
import { Route } from '../types/routes.type';
import { SongsController } from '../controllers';

class DefaultRoute implements Route {
  public path = '/api/songs';

  public router = Router();

  public songsController = new SongsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.songsController.listSongs);
  }
}

export default DefaultRoute;
