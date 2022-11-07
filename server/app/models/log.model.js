module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define("logs", {
    userId: {
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
    },
    request_method: {
      type: DataTypes.STRING,
    },
    endpoint: {
      type: DataTypes.STRING,
    },
    status_code: {
      type: DataTypes.INTEGER,
    },
    content_length: {
      type: DataTypes.STRING,
    },
    response_time: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
    }
  });

  return Log;
};
 