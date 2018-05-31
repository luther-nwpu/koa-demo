const jwt = require('jsonwebtoken')
const secret = 'Npu2015303320'
const tokenMaxage = '3d' // 保存 3 天

const productToken = (userinfo) => {
    return jwt.sign({data: userinfo}, secret, { expiresIn: tokenMaxage })
}
module.exports = {
    productToken: productToken
}
