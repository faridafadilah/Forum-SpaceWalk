const user = require("../controllers/profile.controller"); // Call COntroller

module.exports = (app) => {
  // Retrieve a single Main with id
  app.get("/api/profile/:id", user.findOne);

  // Update a Main with id
  app.patch("/api/profile/:id", user.update);
};
