const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Controller For Register
exports.signup = (req, res) => { 
  const username = req.body.username
  const splitUsername = username.split(' ');
  if (splitUsername[1] !== undefined) return res.status(400).send({ message: "Username Tidak Boleh ada Spasi." });
  // Save User to Database
  User.create({
    username: username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// proses signin
exports.signin = (req, res) => {
  // get user berdasarkan username
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      // compare password
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      // jika password invalid
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password and Username!",
        });
      }

      const authorities = [];
      // get role lalu tanpilkan di respons
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });

      // variabel get token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        config.secret,
        {
          expiresIn: 86400 // 24 hours
        }
      );
    })

    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};