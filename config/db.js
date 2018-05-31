const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'nwpu',
  password: 'Npu2015303320',
  database: 'nwpuorder'
})

function query (connection, queryStr, inputs) {
  return new Promise(function (resolve, reject) {
    connection.query(queryStr, inputs, function (error, results) {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

module.exports = {
  pool: pool,
  query: query
}
