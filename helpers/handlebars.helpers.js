module.exports = {
  ifIncludes: function (condition, value, options) {
    return condition.includes(value) ? options.fn(this) : options.inverse(this)
  },
  ifNull: function (condition, options) {
    return condition === null ? options.fn(this) : options.inverse(this)
  },
  ifEqual: function (arg1, arg2, options) {
    return Number(arg1) === Number(arg2) ? options.fn(this) : options.inverse(this)
  },
}