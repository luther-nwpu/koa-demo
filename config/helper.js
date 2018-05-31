
const tryCatch = (promise) => {
    try {
        const ret = promise
        return [ret, null]
    } catch (e) {
        return [null, e]
    }
}

module.exports = {
    tryCatch: tryCatch
}
