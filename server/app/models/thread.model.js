module.exports = (sequelize, Sequelize) => {
  const Thread = sequelize.define("threads", {
    title: Sequelize.STRING,
    subforumId: Sequelize.INTEGER,
    content: Sequelize.TEXT,
    userId: Sequelize.INTEGER,
    userName: Sequelize.STRING,
    userImage: Sequelize.STRING,
    image: Sequelize.STRING,
    url: Sequelize.STRING,
  });

  return Thread;
};
