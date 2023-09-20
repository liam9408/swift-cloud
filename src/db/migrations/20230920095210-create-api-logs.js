module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('apiLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { type: Sequelize.STRING },
      method: { type: Sequelize.STRING },
      path: { type: Sequelize.STRING },
      caller: { type: Sequelize.STRING },
      hostname: { type: Sequelize.STRING },
      duration: { type: Sequelize.STRING },
      req: { type: Sequelize.JSONB },
      res: { type: Sequelize.JSONB },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('apiLogs');
  },
};
