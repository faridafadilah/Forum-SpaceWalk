module.exports = (sequelize, Sequelize) => {
  const Sub = sequelize.define(
    "subforums",
    {
      judul: Sequelize.STRING,
      description: Sequelize.TEXT,
      image: Sequelize.STRING,
      url: Sequelize.STRING,
      mainforumId: Sequelize.INTEGER,
    },
    {
      timestamps: true,
    }
  );

  return Sub;
};
