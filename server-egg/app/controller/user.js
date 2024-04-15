'use strict'

const Controller = require('egg').Controller

// 默认头像，放在 user.js 的最外，部避免重复声明。
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller {
    async register() {
        const { ctx } = this
        const {username, password} = ctx.request.body

        if (!username || !password) {
            ctx.body = {
                code: 500,
                msg: '账号密码不能为空',
                data: null
            }
            return
        }

        // 判断数据库中是否有当前输入的用户名
        const userInfo = await ctx.service.user.getUserByName(username)
        // 如果已经存在该用户名，则提示重新输入
        if (userInfo && userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账户名已经被注册，请重新输入',
                data: null
            }
            return
        }

        // 调用register方法存入新账号
        const result = ctx.service.user.register({
            username,
            password,
            signature: '毁灭吧世界',
            avatar: defaultAvatar
        })

        if (result) {
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }

    }

    async login() {
        // app 是全局属性，相当于所有的插件方法都植入到app对象中
        const { ctx, app } = this
        // 获取用户输入的用户名和密码
        const { username, password } = ctx.request.body
        // 根据用户名，在数据库中查找对应的id数据
        const userInfo = await ctx.service.user.getUserByName(username)
        console.log(111111, username, userInfo)
        if (!userInfo || !userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账号不存在',
                data: null
            }
            return
        }

        if (userInfo && userInfo.password !== password) {
            ctx.body = {
                code: 500,
                msg: '账号密码错误',
                data: null
            }
            return
        }

        // 生成token
        // app.jwt.sign({需要加密的内容}, 加密字符串)
        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            exp: Math.floor(Date.now() / 1000) + (24*60*60) // 有效期24小时
        }, app.config.jwt.secret)

        ctx.body = {
            code: 200,
            msg: '登录成功',
            data: {
                token
            }
        }
    }

    // 测试验证加密内容能否正常解析
    async test() {
        const { ctx, app } = this
        const token = ctx.request.header.authorization
        // 解析token
        const decode = await app.jwt.verify(token, app.config.jwt.secret)
        ctx.body = {
            code: 200,
            msg: '获取成功',
            data: {
                ...decode
            }
        }
    }

    async getUserInfo() {
        const { ctx, app } = this
        const token = ctx.request.header.authorization
        const decode = await app.jwt.verify(token, app.config.jwt.secret)
        const userInfo = await ctx.service.user.getUserByName(decode.username)
        ctx.body = {
            code: 200,
            msg: '',
            data: {
                id: userInfo.id,
                username: userInfo.username,
                signature: userInfo.signature || '',
                avatar: userInfo.avatar || defaultAvatar
            }
        }
    }

    async editUserInfo() {
        const { ctx, app } = this
        // 获取请求体中的签名
        const editUserInfo = ctx.request.body

        try {
            // 获取token解析用户名称
            const token = ctx.request.header.authorization
            const decode = await app.jwt.verify(token, app.config.jwt.secret)
            if (!decode) return
            const user_id = decode.id
            const userInfo = await ctx.service.user.getUserByName(decode.username)
            // 通过service的editUserInfo修改signature
            const result = await ctx.service.user.editUserInfo({
                ...userInfo,
                ...editUserInfo
            })

            ctx.body = {
                code: 200,
                msg: '',
                data: {
                    id: user_id,
                    ...editUserInfo
                }
            }
        } catch(error) {
            console.log(error)
        }
    }
}
 
module.exports = UserController
