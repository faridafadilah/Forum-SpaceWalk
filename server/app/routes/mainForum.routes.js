const { authJwt } = require("../middleware");
const main = require("../controllers/mainForum.controller");// Call Controller

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create main
  app.post("/api/main/create", [authJwt.verifyToken], main.create);

  // Retrieve all main
  app.get("/api/main/", main.findAll);
 
  // Retrieve a single Main with id
  app.get("/api/main/:id", main.findOne);

  // Update a Main with id
  app.patch("/api/main/:id", [authJwt.verifyToken], main.update);

  // Delete a Main with id
  app.delete("/api/main/:id", [authJwt.verifyToken], main.delete);
};