import { Request } from 'express';

export interface RequestWithFile extends Request {
  //   identityId?: number; // todo: uncomment when have authentication
  files: any;
}
