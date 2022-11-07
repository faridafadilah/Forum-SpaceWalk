const express = require("express");
const FileUpload = require('express-fileupload');
const bodyParser = require('body-parser'); // For parsing
const cors = require('cors'); // Module Cors
const morgan = require('morgan');
const middlewares =require("./app/middleware");

const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(middlewares.morganMiddleware);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(FileUpload());
app.use(express.static("public"));

// database
const db = require("./app/models");
const Role = db.role;

// Refresh Table
// db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to SpaceWalk application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/mainForum.routes')(app);
require('./app/routes/subForum.routes')(app);
require('./app/routes/thread.routes')(app);
require('./app/routes/comment.routes')(app);
require('./app/routes/profile.routes')(app)
require('./app/routes/log.routes')(app);
require('./app/routes/userRole.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}