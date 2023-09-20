/* IoC Container */
import 'reflect-metadata';
import { Container } from 'inversify';

import { SERVICE_IDENTIFIER } from '../constants';
import ServerConfig from './server.config';

import { DefaultService } from '../services';

const container = new Container();

container
  .bind<ServerConfig>(SERVICE_IDENTIFIER.SERVER_CONFIG)
  .to(ServerConfig)
  .inSingletonScope();

container
  .bind<DefaultService>(SERVICE_IDENTIFIER.DEFAULT_SERVICE)
  .to(DefaultService);

export default container;
