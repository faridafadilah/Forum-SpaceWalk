const { authJwt } = require("../middleware");
const thread = require("../controllers/thread.controller");// Call Controller

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

   // Create thread
   app.post("/api/thread/create",[authJwt.verifyToken], thread.create);

   // Retrieve all thread
   app.get("/api/thread/", thread.findAll);
 
   // Retrieve a single Thread with id
   app.get("/api/thread/:id", thread.findOne);
 
   // Retrieve Thread By User
   app.get("/api/thread/user/:userId", thread.getAllThreadByUserId);
 
   // Delete a Thread with id
   app.delete("/api/thread/:id", [authJwt.verifyToken], thread.delete);
};