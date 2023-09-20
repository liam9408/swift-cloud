import { Router } from 'express';
import multer from 'multer';

import { Route } from '../types/routes.type';
import { ImportController } from '../controllers';
import csvValidator from '../middlewares/csvValidator.middleware';

const upload = multer();
const uploadFields = upload.fields([{ name: 'file', maxCount: 1 }]);

class ImportRoute implements Route {
  public path = '/api/import';

  public router = Router();

  public importController = new ImportController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/songs`,
      uploadFields,
      csvValidator,
      this.importController.batchImportData
    );
  }
}

export default ImportRoute;
