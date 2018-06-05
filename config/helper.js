const request = require('request')
const Buffer = require('safe-buffer').Buffer
const crypto = require('crypto')
/**
 * try Catch 打包 方便 const [res, error] 这样调用
 * @param {Function} promise
 */
const tryCatch = (promise) => {
    try {
        const ret = promise
        return [ret, null]
    } catch (e) {
        return [null, e]
    }
}
/**
 * 去生成一个错误Error
 * @author 张露
 * @param {Error | String} errMessage 本身初始化的错误
 * @param {int} status 状态码
 * @param {String} userMessage 返回给用户的消息
 * @returns Error() 返回一个新的错误
 */
const createError = (errMessage, status, userMessage) => {
    let error
    if (typeof errMessage === 'string' || errMessage instanceof String) {
        error = new Error(errMessage)
    } else {
        error = errMessage
    }
    error.status = status
    error.userMessage = userMessage
    return error
}

/**
 * 获取openid 和 session_key
 * @param { String } code 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
 * @param { String } appid 微信小程序appid
 * @param { String } secret 微信小程序的密钥appkey
 */
const privateData = async (code, appid, secret) => {
    // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                const bodyData = JSON.parse(body)
                bodyData.openid === undefined ? reject(new Error('Invalid Code')) : resolve(bodyData)
            }
        })
    })
}

/**
 * 返回用户的敏感信息
 * @param {*} encryptedData 包括敏感数据在内的完整用户信息的加密数据
 * @param {*} sessionKey 会话密钥
 * @param {*} iv 加密算法的初始向量，详细见加密数据解密算法
 * @param {*} appId 微信小程序的appId
 */
const decryptData = (encryptedData, sessionKey, iv, appId) => {
    // base64 decode
    sessionKey = Buffer.from(sessionKey, 'base64')
    encryptedData = Buffer.from(encryptedData, 'base64')
    iv = Buffer.from(iv, 'base64')
    try {
        // 解密
        let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
        // 设置自动 padding 为 true，删除填充补位
        decipher.setAutoPadding(true)
        /* eslint-disable */
        var decoded = decipher.update(encryptedData, 'binary', 'utf8')
        /* eslint-enable */

        decoded += decipher.final('utf8')
        decoded = JSON.parse(decoded)
    } catch (error) {
        throw createError('Illegal Buffer', 500, '用户信息解析错误')
    }
    if (decoded.watermark.appid !== appId) {
        throw createError('Illegal Buffer', 500, '用户信息解析错误')
    }
    return decoded
}

module.exports = {
    tryCatch: tryCatch,
    createError: createError,
    privateData: privateData,
    decryptData: decryptData
}
