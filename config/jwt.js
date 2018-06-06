const jwt = require('jsonwebtoken')
const secret = 'Npu2015303320'
const tokenMaxage = '0.5h' // 保存 30 分钟
const createError = require('./helper').createError
const productToken = (userinfo) => {
    return jwt.sign({data: userinfo}, secret, { expiresIn: tokenMaxage })
}

const UnAuthorizationUrl = new Set(['GET:/users/session', 'POST:/users', 'GET:/test'])

const KoaJwt = async (ctx) => {
    try {
        if (!UnAuthorizationUrl.has(ctx.method + ':' + ctx.url)) {
            if (ctx.request.header.authorization && ctx.request.header.authorization.split(' ')[0] === 'Bearer') {
                const decoded = await new Promise((resolve, reject) => {
                    jwt.verify(ctx.request.header.authorization.split(' ')[1], secret, (err, decoded) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(decoded)
                    })
                })
                ctx.state.userId = decoded.data
            }
        }
    } catch (err) {
        throw createError(new Error('UnAuthorization'), 505, '用户未登录')
    }
}
module.exports = {
    productToken: productToken,
    KoaJwt: KoaJwt
}
