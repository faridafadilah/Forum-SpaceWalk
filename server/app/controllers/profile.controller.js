const db = require('../models') // Call Models Table
const User = db.user // Model User
const fs = require('fs') // Module File System
const path = require('path') // Module Path

// Controller For Find One By Id Main Forum
exports.findOne = async (req, res) => {
  const id = req.params.id
  // Find By Id
  User.findByPk(id)
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

// Controller For Update Profile
exports.update = async (req, res) => {
  const users = await User.findOne({
    where: {
      id: req.params.id,
    },
  })
  if (!users) return res.status(404).json({ msg: 'No Data Found' })
  const profileDefault = 'default-profile.jpg'
  let fileName = ''
  let url = ''
  if (req.files === null) {
    fileName = users.image
    url = users.url
  } else {
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 + ext
    url = `${req.protocol}://${req.get('host')}/imageProfile/${fileName}`
    const allowedType = ['.png', '.jpg', '.jpeg']

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' })
    if (fileSize > 10000000) return res.status(422).json({ msg: 'Image must be less than 10 MB' })

    if (users.image) {
      const filepath = `./public/imageProfile/${users.image}`
      fs.unlinkSync(filepath)
    }

    file.mv(`./public/imageProfile/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message })
    })
  }
  // Request Body
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const bio = req.body.bio
  const gender = req.body.gender
  const address = req.body.address
  const hobies = req.body.hobies
  const birth = req.body.birth
  const github = req.body.github
  const whatsapp = req.body.whatsapp
  const linkedin = req.body.linkedin
  

  try {
    // Update Data
    await User.update(
      {
        username: username,
        email: email,
        password: password,
        bio: bio,
        gender: gender,
        address: address,
        hobies: hobies,
        birth: birth,
        github: github,
        whatsapp: whatsapp,
        linkedin: linkedin,
        image: fileName,
        url: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    res.status(200).json({ msg: 'User Updated Successfuly' })
  } catch (error) {
    console.log(error.message)
  }
}