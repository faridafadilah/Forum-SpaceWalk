module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.STRING
    },
    github: {
      type: Sequelize.STRING,
    },
    whatsapp: {
      type: Sequelize.STRING,
    },
    linkedin: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    hobies: {
      type: Sequelize.STRING,
    },
    birth: {
      type: Sequelize.DATE
    }
  });

  return User;
};