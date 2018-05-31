const router = require('koa-router')()
const superagent = require('superagent')
const cheerio = require('cheerio')
const jwt = require('../config/jwt')

router.prefix('/login')

router.post('/', function (ctx, next) {
    const username = ctx.query.username
    const password = ctx.query.password
    // 西工大教务系统网站
    superagent.post('http://us.nwpu.edu.cn/eams/login.action')
        .type('form')
        // 设置中文，这样错误信息就能返回中文了
        .set('Accept-Language', 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3')
        .send({
            username: username,
            password: password
        })
        .end((err, sres) => {
            if (err) {
                next(err)
            } else if (!sres.ok) {
                next(new Error('爬虫出现问题'))
            } else {
                // 处理页面
                // 处理页面内容
                let $ = cheerio.load(sres.text)

                // 找到类似 .welcome_bar 的字段
                const content = $('.welcome_bar').html()
                $ = cheerio.load(content)
                const userinfo = $('a[href="/eams/security/my.action"]', 'form').text()
                console.log(userinfo)
                const userrole = $('span[style="padding:0 2px;color:#FFF;font-weight:blod;"]').text()
                console.log(userrole)
                console.log(jwt.productToken(userinfo))
            }
        })
})

module.exports = router
