const fs = require('fs') // Module File System
const path = require('path') // Module Path
const db = require('../models') // Call Model
const subForum = db.sub // Call Model User
const Op = db.Sequelize.Op

// Controller For Create Sub Forum
exports.create = async (req, res) => {
  subForum
    .findOne({
      where: {
        judul: req.body.judul,
        mainforumId: req.body.mainforumId,
      },
    })
    .then((sub) => {
      if (sub) {
        res.status(400).send({
          message: 'Failed! Name is already in use!',
        })
      } else {
        const judul = req.body.judul
        const description = req.body.description
        const mainforumId = req.body.mainforumId
        const file = req.files.file
        const fileSize = file.data.length
        const ext = path.extname(file.name)
        const fileName = file.md5 + ext
        const url = `${req.protocol}://${req.get('host')}/imageSub/${fileName}`
        const allowedType = ['.png', '.jpg', '.jpeg']
        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: 'Invalid Images' })
        }
        if (fileSize > 10000000) {
          return res.status(422).json({ msg: 'Image must be less than 10 MB' })
        }
        file.mv(`./public/imageSub/${fileName}`, async (err) => {
          if (err) return res.status(500).json({ msg: err.message })
          // Save subForum in the database
          subForum
            .create({
              judul: judul,
              description: description,
              mainforumId: mainforumId,
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
            })
        })
      }
    })
}

// Controller For Find All Data Sub Forum
exports.findAll = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0
  const limit = parseInt(req.query.limit) || 10

  let result = []
  if (last_id < 1) {
    const results = await subForum
      .findAll({
        where: {
          mainforumId: req.query.mainforumId,
        },
        order: [['id', 'DESC']],
        limit: limit,
      })
      result = results
  } else {
    const results = await subForum
    .findAll({
      where: {
        mainforumId: req.query.mainforumId,
        id: {
          [Op.lt]: last_id,
        }
      },
      order: [['id', 'DESC']],
      limit: limit
    })
    result = results
  }
  res.json({
    result: result,
    lastId: result.length ? result[result.length - 1].id : 0,
    hasMore: result.length >= limit ? true : false,
  })
}

// Controller For Find One By Id Sub Forum
exports.findOne = async (req, res) => {
  const id = req.params.id

  subForum
    .findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find subForum with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving subForum with id=' + id,
      })
    })
}

// Controller For Update Sub Forum
exports.update = async (req, res) => {
  const subs = await subForum.findOne({
    where: {
      id: req.params.id,
    },
  })
  if (!subs) return res.status(404).json({ msg: 'No Data Found' })

  let fileName = ''
  if (req.files === null) {
    fileName = subs.image
  } else {
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 +  ext
    const allowedType = ['.png', '.jpg', '.jpeg']

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' })
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' })

   if(subs.image) {
    const filepath = `./public/imageSub/${subs.image}`
    fs.unlinkSync(filepath)
   }

    file.mv(`./public/imageSub/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message })
    })
  }
  const judul = req.body.judul
  const description = req.body.description
  const mainforumId = req.body.mainforumId
  const url = `${req.protocol}://${req.get('host')}/imageSub/${fileName}`

  try {
    await subForum.update(
      {
        judul: judul,
        description: description,
        mainforumId: mainforumId,
        image: fileName,
        url: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    res.status(200).json({ msg: 'mains Updated Successfuly' })
  } catch (error) {
    console.log(error.message)
  }
}

// Controller For Delete Sub Forum
exports.delete = async (req, res) => {
  const id = req.params.id
  const sub = await subForum.findOne({
    where: {
      id: id,
    },
  })
  if(sub.image) {
    const filepath = `./public/imageSub/${sub.image}`
    fs.unlinkSync(filepath)
  }

  subForum
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Sub Forum was deleted success!',
        })
      } else {
        res.send({
          message: 'Cannot delete with id' + id,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Sub Forum with id' + id,
      })
    })
}
