const router = require('koa-router')()
const helper = require('../config/helper')

router.prefix('/users')

router.post('/', async (ctx, next) => {
    const req = ctx.request.body
    try {
        const userinfo = await helper.privateData(req.code, req.appId, req.appKey)
        console.log('encryptedData', req.encryptedData)
        console.log('userinfo', userinfo)
        console.log('appId', req.appId)
        console.log('iv', req.iv)
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
