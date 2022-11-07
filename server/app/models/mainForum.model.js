module.exports = (sequelize, Sequelize) => {
  const Main = sequelize.define("mainforums", {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    image: Sequelize.STRING,
    url: Sequelize.STRING,
  });

  return Main;
};