const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'nwpu',
    password: 'Npu2015303320',
    database: 'nwpuorder'
})

/**
 * 数据库执行操作
 * @param {connection} connection 提供给数据库查询的connection
 * @param {String} queryStr 需要执行的sql语句
 * @param {Array} inputs sql语句里面需要替换的数据
 */
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
