'use strict'

/**
 * 
 * @param {*} secret 
 * @returns 
 * 中间件默认抛出一个函数，函数返回jwtErr(ctx: 上下文，可以在ctx中拿到全局对象app, next)
 * 首先，通过 ctx.request.header.authorization获取到请求头中的authorization 属性（也就是token值），如果没有携带token，该字符串为null
 * 判断如果有token，使用 ctx.app.jwt.verify方法验证token是否存在并且有效。
 * 如果存在且有效，则通过验证 await next() 继续执行后续的接口逻辑，否则判断是失效还是不存在该token
 */
module.exports = (secret) => {
    return async function jwtErr(ctx, next) {
        const token = ctx.request.header.authorization // 若是没有token，返回的是null
        let decode
        if (token != 'null' && token) {
            try {
                decode = ctx.app.jwt.verify(token, secret) // 验证token
                await next()
            } catch(error) {
                console.log('error', error)
                ctx.status = 200
                ctx.body = {
                    msg: 'token已经过期，请重新登录',
                    code: 401
                }
                return
            }
        } else {
            ctx.status = 200
            ctx.body = {
                code: 401,
                msg: 'token不存在'
            }
            return
        }
    }
}