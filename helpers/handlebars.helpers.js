module.exports = {
  ifIncludes: function (condition, value, options) {
    return condition.includes(value) ? options.fn(this) : options.inverse(this)
  }
}