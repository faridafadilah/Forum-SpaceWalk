const db = require('../models') // Call Models
const userRole = db.user_role // Call Model user_role
const User = db.user // Model User
const sequelize = db.sequelize // Sequelize

// Get Data User And Role
exports.getUserRole = (req, res) => {
  sequelize
    .query(
      `SELECT a.username, a.id, b."roleId", c.name FROM users a 
    INNER JOIN user_roles b ON a.id = b."userId" INNER JOIN roles c ON b."roleId" = c.id ORDER BY a.id `
    )
    .then((data) => {
      res.json(data[0])
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occured while retrieving user.',
      })
    })
}

// Find a single user width Id
exports.getUserById = (req, res) => {
  const id = req.params.id

  userRole
    .findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find user By id =${id}`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving user with id=${id}`,
      })
    })
}

// Update Role User
exports.updateUserRole = (req, res) => {
  const userId = req.params.userId

  userRole
    .update(req.body, {
      where: {
        userId: userId,
      },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'user was updated successfull!',
        })
      } else {
        res.send({
          message: `Cannot update user with id= ${userId}`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving user with id=${userId}`,
      })
    })
}

// Get Data By Id
exports.getUserAllById = (req, res) => {
  const id = req.params.id

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find user By id =${id}`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving user with id=${id}`,
      })
    })
}