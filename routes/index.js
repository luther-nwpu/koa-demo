const router = require('koa-router')()
const db = require('../config/db')
const helper = require('../config/helper')

router.get('/test', async (ctx, next) => {
    const res = await new Promise(function (resolve, reject) {
        db.pool.getConnection(async (error, connection) => {
            if (error) {
                reject(error)
            }
            const [res, queryerror] = helper.tryCatch(await db.query(connection, `select * from testdata`, []))
            if (queryerror) {
                reject(queryerror)
            }
            resolve(res)
            connection.release()
        })
    })
    ctx.body = res
})

router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string'
})

router.post('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})

module.exports = router
