'use strict'

const moment = require('moment')

const Controller = require('egg').Controller

class BillsController extends Controller {
    async add() {
        const { ctx, app } = this
        const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body
        // 判空处理
        if (!amount || !type_id || !type_name|| !date || !pay_type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
            return
        }

        try {
            let user_id
            const token = ctx.request.header.authorization
            const decode = await app.jwt.verify(token, app.config.jwt.secret)
            if (!decode) return
            user_id = decode.id
            const result = await ctx.service.bills.add({
                amount, type_id, type_name, date, pay_type, remark, user_id
            })

            ctx.body = {
                code: 100,
                msg: '请求成功',
                data: null
            }
        } catch(error) {
            console.log(error)
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }

        }
    }

    async list() {
        const { ctx, app } = this
        const { date, page, page_size, type_id } = ctx.query

        try {
            let user_id
            const token = ctx.request.header.authorization
            const decode = await app.jwt.verify(token, app.config.jwt.secret)
            if (!decode) return
            user_id = decode.id
            const list = await ctx.service.bills.list(user_id, date, page, page_size, type_id)
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    // 当月支出
                    // 当月收入
                    // 分页数
                    // 当页数据
                }
            }
        }catch(error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async detail() {
        const { ctx, app } = this
        // 获取账单id
        const { id = '' } = ctx.query
        let user_id
        const token = ctx.query.header.authorization
        const decode = await app.jwt.verify(token, app.config.jwt.secret)
        if (!decode) return
        if (!id) {
            ctx.body = {
                code: 500,
                msg: '订单id不能为空',
                data: null
            }
            return
        }

        try {
            const detail = await ctx.service.bills.detail(id, user_id)
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: detail
            }
        }catch(error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async update() {
        const { ctx, app } = this
        const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body
        if (!id || !amount || !type_id || !type_name || !date || pay_type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
            retrun
        }

        try {
            const token = ctx.request.header.authorization
            const decode = await app.jwt.verify(token, app.config.jwt.secret)
            if (!decode.id) return
            const user_id = decode.id
            const result = await ctx.service.bills.update({
                id, amount, type_id, type_name, date, pay_type, remark, user_id
            })
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: null
            }
        } catch(error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    async delete() {
        const { ctx, app } = this
        const { id } = ctx.query.body
        if (!id) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
            return
        }

        try {
            const token = ctx.query.header.authorization
            const decode = await app.jwt.verify(token, app.config.jwt.secret)
            if (!decode.id) retrun
            const user_id = decode.id
            const result = await ctx.service.bills.delete(id, user_id)
            ctx.body = {
                code: 200,
                msg: '',
                data: null
            }
        } catch(error) {
            ctx.body = {
                code: 500,
                msg: '',
                data: null
            }
        }
    }
}

module.exports = BillsController
