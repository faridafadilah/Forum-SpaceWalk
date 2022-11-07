const config = require("../config/db.js");

// Configure Database
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.main = require('./mainForum.model.js')(sequelize, Sequelize)
db.sub = require('./subForum.model.js')(sequelize, Sequelize)
db.thread = require('./thread.model.js')(sequelize, Sequelize)
db.comment = require('./comment.model.js')(sequelize, Sequelize)
db.user_role = require('./userRole.model.js')(sequelize, Sequelize)
db.log = require('./log.model')(sequelize, Sequelize)

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

// Main forum mempunyai banyak sub forum
db.main.hasMany(db.sub)
db.sub.belongsTo(db.main, {
  foreignKey: 'mainforumId',
})

// Sub forum mempunyai banyak Thread
db.sub.hasMany(db.thread)
db.thread.belongsTo(db.sub, {
  foreignKey: 'subforumId'
})
db.thread.belongsTo(db.user, {
  foreignKey: 'userId'
})
db.user.hasMany(db.thread, {
  foreignKey: 'userId'
})

// Thread mempunyai banyak comment(Comment)
db.thread.hasMany(db.comment)
db.comment.belongsTo(db.thread, {
  foreignKey: 'threadId'
})
db.comment.belongsTo(db.user, {
  foreignKey: 'userId'
})

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;