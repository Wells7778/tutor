const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const app = express()
const port = Number(process.env.PORT) || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
routes(app)
app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app