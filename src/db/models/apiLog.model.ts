import { Sequelize, Model, DataTypes } from 'sequelize';

class ApiLog extends Model {
  public static initModel(sequelize: Sequelize): void {
    ApiLog.init(
      {
        name: {
          type: new DataTypes.STRING(255),
        },
        method: {
          type: new DataTypes.STRING(255),
        },
        path: {
          type: new DataTypes.STRING(255),
        },
        caller: {
          type: new DataTypes.STRING(255),
        },
        hostname: {
          type: new DataTypes.STRING(255),
        },
        duration: {
          type: new DataTypes.STRING(255),
        },
        req: { type: DataTypes.JSONB },
        res: { type: DataTypes.JSONB },
      },
      {
        sequelize,
        modelName: 'apiLog',
      }
    );
  }

  public static initAssocation(): void {}
}

export default ApiLog;
