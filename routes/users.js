const router = require('koa-router')()
const helper = require('../config/helper')

router.prefix('/users')

router.post('/', async (ctx, next) => {
    const req = ctx.query
    try {
        const userinfo = helper.privateData(req.code, req.appId, req.appKey)
        const users = helper.decryptData(req.encryptedData, userinfo.session_key, req.iv, req.appId)
        console.log(users)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
})

module.exports = router
