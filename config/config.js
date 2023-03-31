const env = process.env.NODE_ENV || 'development'
if (env !== 'production') {
  require('dotenv').config()
}

const dbCommon = {
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || '0.0.0.0',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  database: 'tutor',
  define: {
    underscored: true,
    charset: 'utf8mb4',
    dialectOptions: {
      collate: 'utf8mb4_unicode_ci',
    },
    timestamps: true,
  },
}

const dbConfig = {
  development: {
    ...dbCommon,
    database: 'tutor_development',
  },
  test: {
    ...dbCommon,
    database: 'tutor_test',
    logging: false,
  },
  production: {
    ...dbCommon,
    logging: false,
  }
}
module.exports = dbConfig
