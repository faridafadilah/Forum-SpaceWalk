const user_roles = require('../controllers/userRole.controller')
const { authJwt } = require('../middleware') // Call Middleware

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
  })

  // Retrieve All user By Id
  app.get('/api/userRole/user/:id', user_roles.getUserAllById)

  // Retrieve All user
  app.get('/api/userRole/', user_roles.getUserRole)

  // Retrieve a single userRole by Id
  app.get('/api/userRole/:id', user_roles.getUserById)

  //Update a single userRole by Id
  app.put('/api/userRole/:userId', [authJwt.verifyToken], user_roles.updateUserRole)
}