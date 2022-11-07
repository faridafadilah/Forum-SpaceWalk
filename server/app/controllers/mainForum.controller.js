const db = require('../models') // Call Model
const mainForum = db.main // Call Model User
const fs = require('fs') // Module File System
const path = require('path') // Module Path
const { sequelize } = require('../models')
const Op = db.Sequelize.Op

// Controller For Create Main Forum
exports.create = async (req, res) => {
  // Find One Data And Validation For Title ready use
  mainForum
    .findOne({
      where: {
        title: req.body.title,
      },
    })
    .then((main) => {
      if (main) {
        res.status(400).send({
          message: 'Failed! Title is already in use!',
        })
      } else {
        // Request Data
        const title = req.body.title
        const description = req.body.description
        const file = req.files.file
        const fileSize = file.data.length
        const ext = path.extname(file.name)
        const fileName = file.md5 + ext
        const url = `${req.protocol}://${req.get('host')}/images/${fileName}`
        const allowedType = ['.png', '.jpg', '.jpeg']

        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: 'Invalid Images' })
        }
        if (fileSize > 10000000) {
          return res.status(422).json({ msg: 'Image must be less than 10 MB' })
        }
        file.mv(`./public/images/${fileName}`, async (err) => {
          if (err) res.status(500).json({ msg: err.message })
          // Save mainForum in the database
          mainForum
            .create({
              title: title,
              description: description,
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

// Controller For Find All Data Main Forum
exports.findAll = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0
  const limit = parseInt(req.query.limit) || 10
  const search = req.query.search_query?.toLowerCase() || ''

  let result = []
  if (last_id < 1) {
    const results = await mainForum.findAll({
      where: {
        [Op.or]: [
          {
            title: sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + search + '%')
            // title: {
            //   [Op.like]: '%' + search + '%',
            // },
          },
        ],
      },
      limit: limit,
      order: [['id', 'DESC']],
    })
    result = results
  } else {
    const results = await mainForum.findAll({
      where: {
        id: {
          [Op.lt]: last_id,
        },
        [Op.or]: [
          {
            title: {
              [Op.like]: '%' + search + '%',
            },
          },
        ],
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

// Controller For Find One By Id Main Forum
exports.findOne = async (req, res) => {
  const id = req.params.id

  mainForum
    .findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find mainForum with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving mainForum with id=' + id,
      })
    })
}

// Controller For Update Main Forum
exports.update = async (req, res) => {
  // Find One data By Id
  const mains = await mainForum.findOne({
    where: {
      id: req.params.id,
    },
  })
  // If Data Not Found
  if (!mains) return res.status(404).json({ msg: 'No Data Found' })

  // File Image And URL
  let fileName = ''
  if (req.files === null) {
    fileName = mains.image
  } else {
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 + ext
    const allowedType = ['.png', '.jpg', '.jpeg']

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' })
    if (fileSize > 10000000) return res.status(422).json({ msg: 'Image must be less than 10 MB' })

    if (mains.image) {
      const filepath = `./public/images/${mains.image}`
      fs.unlinkSync(filepath)
    }

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message })
    })
  }

  const title = req.body.title
  const description = req.body.description
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`

  try {
    await mainForum.update(
      { title: title, description: description, image: fileName, url: url },
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

// Controller For Delete Main Forum
exports.delete = async (req, res) => {
  const id = req.params.id
  const main = await mainForum.findOne({
    where: {
      id: req.params.id,
    },
  })

  if (main.image !== null) {
    const filepath = `./public/images/${main.image}`
    fs.unlinkSync(filepath)
  }
  // Delete By Id
  mainForum
    .destroy({
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
