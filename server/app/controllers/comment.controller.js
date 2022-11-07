const db = require('../models') // Call Model
const Comment = db.comment // Call Model User

// Controller For Create Comment
exports.create = async (req, res) => {
  // Create a New Comment
  const newComment = {
    content: req.body.content,
    threadId: req.body.threadId,
    userId: req.body.userId,
    nameUser: req.body.nameUser,
    imageUser: req.body.imageUser,
  }

  // Save Comment in the database
  Comment.create(newComment)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the sub forum.',
      })
    })
}

// Controller For Find All Data Comment
exports.findAll = async (req, res) => {
  const page = req.query.page
  const perPage = 10

  const comments = await Comment.findAll({
    where: {
      threadId: req.query.threadId,
    },
    limit: perPage,
    offset: perPage * (page - 1),
  })
  res.send(comments) 
}

// Controller For Delete Comment
exports.delete = (req, res) => {
  const id = req.params.id
  // Delete Comment By Id
  Comment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Main Forum was deleted success!',
        })
      } else {
        res.send({
          message: 'Cannot delete with id' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Main Forum with id' + id,
      })
    })
}