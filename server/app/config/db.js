// Config Database
module.exports = {
  host: "localhost",
  user: "postgres",
  password: "rida443355",
  database: "spacewalk",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
