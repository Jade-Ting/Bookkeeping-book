'use strict'

const Service = require('egg').Service

class BillsService extends Service {
    async add(params) {
        const { ctx, app } = this
        try {
            const result = await app.mysql.insert('bills', params)
            return result
        } catch(error) {
            console.log(error)
            return null
        }
    }

    async list(user_id, date, page, page_size, type_id) {
        const { ctx, app } = this
        const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark'
        let sql = `
            select ${QUERY_STR} from bills
            where user_id=${user_id} AND type_id=${type_id}
            order by date
            limit ${page_size} offset ${page_size*(page - 1)}
            `
        try {
            const result = await app.mysql.query(sql)
            return result
        }catch(error) {
            console.log(error)
            return null
        }
    }

    async detail(id, user_id) {
        const { ctx, app } = this
        try {
            const result = await app.mysql.get('bills', { id, user_id })
            return result
        } catch(error) {
            console.log(error)
            return null
        }

    }

    async update(params) {
        const { app } = this
        try {
            const result = await app.mysql.update('bills', {
                ...params // 需要更新的内容
            },{
                // 查询参数
                id: params.id,
                user_id: params.user_id
            })
            return result
        } catch(error) {
            console.log(error)
            return null
        }
    }

    async delete(id, user_id) {
        const { app } = this
        try {
            const result = await app.mysql.delete('bills', {id, user_id})
            return result
        } catch(error) {
            console.log(error)
            return null
        }
    }

}

module.exports = BillsService
