'use strict'

const Service = require('egg').Service

class UserService extends Service {
    async getUserByName(username) {
        const {ctx, app} = this
        try {
            const result = await app.mysql.get('user', {username})
            return result
        } catch(error) {
            console.log(error)
            return null
        }
    }

    async register(params) {
        const {app} = this
        try {
            const result = await app.mysql.insert('user', params)
            return result
        } catch(error) {
            console.log(error)
            return null
        }
    }

    async editUserInfo(params) {
        console.log(params)
        const { ctx, app } = this
        try {
            // 通过app.mysql.update指定user表
            let result = await app.mysql.update('user', {
                ...params // 要修改的参数
            },{
                id: params.id // 筛选id对应的用户
            })
            return result
        } catch(error) {
            console.log(error)
            return null
        }

    }
}

module.exports = UserService