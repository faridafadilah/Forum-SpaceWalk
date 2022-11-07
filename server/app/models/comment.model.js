module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    threadId: Sequelize.INTEGER,
    content: Sequelize.TEXT,
    userId: Sequelize.INTEGER,
    nameUser: Sequelize.STRING,
    imageUser: Sequelize.STRING,
  });

  return Comment;
};
