const mysql = require('mysql')
export const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'nwpu',
  password: 'nwpuorder',
  database: 'Nwpu2015303320'
})

export function query (connection, queryStr, inputs) {
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
