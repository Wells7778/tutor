const service = require('../services/user.services')
const AdminController = {
  async indexPage(req, res, next) {
    const query = req.query
    const { page = 1, perPage = 6, search = '' } = query
    const { data: users, pagination } = await service.index({ page, limit: perPage, search })
    return res.render('admin', {
      pagination,
      users,
      page,
      perPage,
      search,
    })
  },
  async coursesPage(req, res, next) {

  }
}

module.exports = AdminController
