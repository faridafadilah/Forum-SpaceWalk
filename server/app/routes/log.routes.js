const logs = require("../controllers/log.controller");

module.exports = (app) => {
  // Retrieve all log
  app.get("/api/log/", logs.findAll);
};
