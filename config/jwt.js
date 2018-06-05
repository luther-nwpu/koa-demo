const jwt = require('jsonwebtoken')
const secret = 'Npu2015303320'
const tokenMaxage = '0.5h' // 保存 30 分钟

const productToken = (userinfo) => {
    return jwt.sign({data: userinfo}, secret, { expiresIn: tokenMaxage })
}
module.exports = {
    productToken: productToken
}
