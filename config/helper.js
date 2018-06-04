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
 *
 * @param { String } code 获取用户的
 * @param { String } appid
 * @param { String } secret
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

const decryptData = (encryptedData, sessionKey, iv, appId) => {
    // base64 decode
    sessionKey = new Buffer(sessionKey, 'base64')

    encryptedData = new Buffer(encryptedData, 'base64')

    iv = new Buffer(iv, 'base64')

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
    } catch (err) {
        throw err
    }

    if (decoded.watermark.appid !== appId) {
        console.log('---------------------------------6')
        throw new Error('Illegal Buffer')
    }
    return decoded
}

module.exports = {
    tryCatch: tryCatch,
    createError: createError,
    privateData: privateData,
    decryptData: decryptData
}
