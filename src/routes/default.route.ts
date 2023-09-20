import { Router } from 'express';
import { Route } from '../types/routes.type';
import { DefaultController } from '../controllers';

class DefaultRoute implements Route {
  public path = '/api';

  public router = Router();

  public defaultController = new DefaultController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/health`, async (req, res) => {
      res.status(200).json({ ok: true });
    });

    this.router.get(
      `${this.path}/test-db`,
      this.defaultController.testDatabase
    );
  }
}

export default DefaultRoute;
