const db = require('../models') // Call Model
const Log = db.log // Call Model Log
const Op = db.Sequelize.Op
const { sequelize } = require('../models')

exports.findAll = async(req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search_query?.toLowerCase() || '';
  const offset = limit * page;

  const totalRows = await Log.count({
    where: {
      [Op.or]: [
        {
          username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), 'LIKE', '%' + search + '%')
        },
        {
          date: {
            [Op.like]: `%${search}%`,
          },
        }
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await Log.findAll({
    where: {
      [Op.or]: [
        {
          username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), 'LIKE', '%' + search + '%')
        },
        {
          date: {
            [Op.like]: `%${search}%`,
          },
        }
      ],
    },
    offset: offset,
    limit: limit,
    order: [['id', 'DESC']],
  });

  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
}
