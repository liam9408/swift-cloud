module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('songPlays', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      songId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'songs',
          key: 'id',
        },
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      playCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => queryInterface.dropTable('songPlays'),
};
