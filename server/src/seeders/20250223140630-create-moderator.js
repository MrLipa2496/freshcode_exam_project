module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('moderator', 10);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Moderator',
          lastName: 'Moderatorovich',
          displayName: 'mod123',
          password: hashedPassword,
          email: 'moderator@gmail.com',
          avatar: 'avatar.png',
          role: 'moderator',
          balance: 0,
          accessToken: null,
          rating: 0,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'Users',
      { email: 'moderator@gmail.com' },
      {}
    );
  },
};
