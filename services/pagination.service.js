module.exports = class PaginationService {
  constructor(model) {
    this.model = model
  }

  _pagination({ page, perPage, total }) {
    const lastPage = Math.ceil(total / perPage)
    return {
      total,
      perPage,
      page,
      lastPage,
      nextPage: page + 1 > lastPage ? null : page + 1,
      prevPage: page - 1 < 1 ? null : page - 1,
      pageNumbers: Array.from({ length: lastPage }, (_, i) => i + 1),
    }
  }

  async getPaginatedData({ page, limit, order, condition }) {
    const offset = (page - 1) * limit
    const searchCondition = {
      ...condition,
      offset,
      limit,
      order,
    }
    const countCondition = Object.assign({}, condition)
    delete countCondition.attributes

    const total = await this.model.count(countCondition)
    const data = await this.model.findAll(searchCondition)

    return { data, pagination: this._pagination({ page, perPage: limit, total }) }
  }
}
