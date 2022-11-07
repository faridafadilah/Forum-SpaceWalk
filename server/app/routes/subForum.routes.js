const { authJwt } = require("../middleware");
const sub = require("../controllers/subForum.controller");// Call Controller

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create sub
  app.post("/api/sub/create", [authJwt.verifyToken], sub.create);

  // Retrieve all sub
  app.get("/api/sub/", sub.findAll);

  // Retrieve a single Sub with id
  app.get("/api/sub/:id", sub.findOne);

  // Update a Sub with id
  app.patch("/api/sub/:id", [authJwt.verifyToken], sub.update);

  // Delete a Sub with id
  app.delete("/api/sub/:id", [authJwt.verifyToken], sub.delete);
};