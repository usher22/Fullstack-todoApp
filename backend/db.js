require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // safe for local/dev; use true in prod
      },
    },
    logging: false,
  });
}
 else {
  // 💻 Local development
  sequelize = new Sequelize(
    process.env.DB_NAME || 'todos_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || '123',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = sequelize;

