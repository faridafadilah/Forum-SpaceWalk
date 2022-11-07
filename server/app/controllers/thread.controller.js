const db = require('../models') // Call Model
const Thread = db.thread // Call Model User
const fs = require('fs') // Module File System
const path = require('path') // Module Path
const { Op } = require('sequelize')

// Controller For Create Thread
exports.create = (req, res) => {
  // Request Body
  const title = req.body.title
  const content = req.body.content
  const subforumId = req.body.subforumId
  const userId = req.body.userId
  const userName = req.body.userName
  const userImage = req.body.userImage
  // If Tidak memasukan Gambar
  if (req.files !== null) {
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const allowedType = ['.png', '.jpg', '.jpeg']
    const url = `${req.protocol}://${req.get('host')}/imageThread/${fileName}`

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' })
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' })
    file.mv(`./public/imageThread/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message })
    })

    // Save Thread in the database
    Thread.create({
      title: title,
      content: content,
      subforumId: subforumId,
      userId: userId,
      userName: userName,
      userImage: userImage,
      image: fileName,
      url: url,
    })
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating the main forum.',
        })
        return
      })
  } else {
    // Save Thread in the database
    Thread.create({
      title: title,
      content: content,
      subforumId: subforumId,
      userId: userId,
      userName: userName,
      userImage: userImage,
    })
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating the main forum.',
        })
        return
      })
  }
}

// Controller For Find All Thread
exports.findAll = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0
  const limit = parseInt(req.query.limit) || 10

  let result = []
  if (last_id < 1) {
    const results = await Thread.findAll({
      where: {
        subforumId: req.query.subforumId,
      },
      order: [['id', 'DESC']],
      limit: limit,
    })
    result = results
  } else {
    const results = await Thread.findAll({
      where: {
        subforumId: req.query.subforumId,
        id: {
          [Op.lt]: last_id,
        },
      },
      order: [['id', 'DESC']],
      limit: limit,
    })
    result = results
  }
  res.json({
    result: result,
    lastId: result.length ? result[result.length - 1].id : 0,
    hasMore: result.length >= limit ? true : false,
  })
}

// Controller For Find One Thread By ID
exports.findOne = (req, res) => {
  const id = req.params.id

  Thread.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Thread with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Thread with id=' + id,
      })
    })
}

// Controller For Delete Thread
exports.delete = async (req, res) => {
  const id = req.params.id
  const thread = await Thread.findOne({
    where: {
      id: id,
    },
  })

  if (thread.image) {
    const filepath = `./public/imageThread/${thread.image}`
    fs.unlinkSync(filepath)
  }

  Thread.destroy({
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

// Controller For Post By user Id
exports.getAllThreadByUserId = async (req, res) => {
  const userId = req.params.userId
  const last_id = parseInt(req.query.lastId) || 0
  const limit = parseInt(req.query.limit) || 5
  let result = []
  if (last_id < 1) {
    const results = await Thread.findAll({
      where: {
        userId: userId,
      },
      limit: limit,
      order: [['id', 'DESC']],
    })
    result = results
  } else {
    const results = await Thread.findAll({
      where: {
        userId: userId,
        id: {
          [Op.lt]: last_id,
        },
      },
      limit: limit,
      order: [['id', 'DESC']],
    })
    result = results
  }
  res.json({
    result: result,
    lastId: result.length ? result[result.length - 1].id : 0,
    hasMore: result.length >= limit ? true : false,
  })
}
