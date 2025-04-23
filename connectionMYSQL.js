const mysql = require('mysql2/promise')

async function createConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'gamesDB'
  })
  return connection
}

module.exports = createConnection