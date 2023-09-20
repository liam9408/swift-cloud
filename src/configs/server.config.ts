import { injectable } from 'inversify';
import { ServerConfig } from '../types/configs.type';

@injectable()
class ServerConfigImpl implements ServerConfig {
  public env: string;

  public port: number;

  public apiUrl: string;

  public dbHost: string;

  public dbName: string;

  public dbUser: string;

  public dbPassword: string;

  constructor() {
    this.env = process.env.NODE_ENV || 'local';
    this.port = (process.env.PORT as any as number) || 3000;
    this.dbHost = process.env.POSTGRES_HOST || '';
    this.dbName = process.env.POSTGRES_DATABASE || '';
    this.dbUser = process.env.POSTGRES_USERNAME || '';
    this.dbPassword = process.env.POSTGRES_PASSWORD || '';
  }
}

export default ServerConfigImpl;
