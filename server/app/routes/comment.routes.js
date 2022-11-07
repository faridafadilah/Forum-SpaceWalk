const { authJwt } = require("../middleware");
const comment = require("../controllers/comment.controller");// Call Controller

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

   // Create comment
   app.post("/api/comment/create", comment.create);

   // Retrieve all comment
   app.get("/api/comment/", comment.findAll);
 
   // Delete a comment with id
   app.delete("/api/comment/:id", [authJwt.verifyToken], comment.delete);
};