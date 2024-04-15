'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  /** ----------get获取申明的参数 start------------ */
  async index() {
    const { ctx } = this;
    // ctx.body = 'hi, egg';
    const { id } = ctx.query
    ctx.body = id
  }

  async user() {
    const { ctx } = this
    // 通过params获取申明的参数
    const { id } = ctx.params
    const result = await ctx.service.home.user();
    ctx.body = result
  }
  /** ----------get获取申明的参数 end------------ */

  /** ----------post获取请求参数 start------------ */
  // 浏览器无法直接查看post请求，可以使用postman查看
  async addUser() {
    const { ctx } = this
    const { name } = ctx.request.body
    try {
      const result = await ctx.service.home.addUser(name);
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: null
      };
    } catch(error) {
      ctx.body = {
        code: 500,
        msg: '添加失败',
        data: null
      };
    }
  }

  async editUser() {
    const { ctx } = this
    const {id, name} = ctx.request.body
    try {
      const result = await ctx.service.home.editUser(id, name)
      ctx.body = {
        code: 200,
        msg: '修改成功',
        data: null
      }
    } catch(error) {
      ctx.body = {
        code: 500,
        msg: '修改失败',
        data: null
      }
    }
  }

  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const result = await ctx.service.home.deleteUser(id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null
      }
    } catch(error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null
      }
    }
  }

  /** ----------post获取请求参数 end------------ */


}

module.exports = HomeController;
