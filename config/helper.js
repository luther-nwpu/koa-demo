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

module.exports = {
    tryCatch: tryCatch,
    createError: createError
}
