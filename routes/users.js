const router = require('koa-router')()
const helper = require('../config/helper')
const db = require('../config/db')
const uuid = require('uuid')
const jwt = require('../config/jwt')

router.prefix('/users')

const getUserinfo = async (code, appId, appKey, encryptedData, iv) => {
    const userinfo = await helper.privateData(code, appId, appKey)
    const users = helper.decryptData(encryptedData, userinfo.session_key, iv, appId)
    return {
        openid: users.openId,
        wx_info: {
            nickname: users.nickName,
            gender: users.gender,
            language: users.language,
            city: users.city,
            province: users.province,
            country: users.country,
            avatarUrl: users.avatarUrl,
            watermark: users.watermark
        }
    }
}

router.post('/', async (ctx, next) => {
    const req = ctx.request.body
    const [res, error0] = helper.tryCatch(await new Promise(async(resolve, reject) => {
        const [userres, error1] = helper.tryCatch(await getUserinfo(req.code, req.appId, req.appKey, req.encryptedData, req.iv))
        if (error1) { reject(error1) }

        db.pool.getConnection(async (error2, connection) => {
            if (error2) { reject(error2) }
            let userId
            const [existRes, error3] = helper.tryCatch(await db.query(connection, `select user_id from users where wx_openid = ?`, [userres.openid]))
            if (error3) { reject(error3) }
            if (existRes.length === 1) {
                userId = existRes[0].user_id
                const [, error4] = helper.tryCatch(await db.query(connection, `update users set wx_info = ? where user_id = ?`, [JSON.stringify(userres.wx_info), userId]))
                if (error4) { reject(error4) }
            } else {
                userId = uuid.v1()
                const [, error5] = helper.tryCatch(await db.query(connection, `insert into users(user_id, wx_openid, wx_info) values(?, ?, ?)`, [userId, userres.openid, JSON.stringify(userres.wx_info)]))
                if (error5) { reject(error5) }
            }
            const [queryRes, error6] = helper.tryCatch(await db.query(connection, `select user_id, wx_openid, wx_info, stuid, createTime, updateTime from users where user_id = ?`, [userId]))
            if (error6) { reject(error6) }
            const token = jwt.productToken(userId)
            if (queryRes.length === 0) { reject(helper.createError('No This User', 500, '用户登录失败')) }
            resolve({ token: token, userInfo: queryRes[0] })
            connection.release()
        })
    }))
    if (error0) { next(error0) }
    ctx.body = res
})

const getOpenId = async (code, appId, appKey, encryptedData, iv) => {
    const userinfo = await helper.privateData(code, appId, appKey)
    return {
        openid: userinfo.openId
    }
}

router.post('/session', async (ctx, next) => {
    const req = ctx.request.body
    const [res, error0] = helper.tryCatch(await new Promise(async(resolve, reject) => {
        const [userres, error1] = helper.tryCatch(await getOpenId(req.code, req.appId, req.appKey))
        if (error1) { reject(error1) }

        db.pool.getConnection(async (error2, connection) => {
            if (error2) { reject(error2) }
            console.log(userres)
            const [existRes, error3] = helper.tryCatch(await db.query(connection, `select user_id, wx_openid, wx_info, stuid, createTime, updateTime from users where wx_openid = ?`, [userres[0].openid]))
            if (error3) { reject(error3) }
            if (existRes.length !== 1) {
                reject(helper.createError('sessions no User', 500, '没有该用户'))
            }
            const token = jwt.productToken(existRes[0].user_id)
            resolve({ token: token, userInfo: existRes[0] })
            connection.release()
        })
    }))
    if (error0) { next(error0) }
    ctx.body = res
})

router.get('/tunnel', async (ctx, next) => {
    console.log(ctx.state.user)
    db.pool.getConnection(async (error0, connection) => {
        db.query(connection, `select tunnel_id, user_id, createTime, updateTime from tunnel_id where user_id = ?`, [ctx.state.user])
    })
})
module.exports = router
