'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret)

  router.get('/', controller.home.index);
  // router.get('/user/:id', controller.home.user);
  router.get('/user', controller.home.user);
  router.post('/add_user', controller.home.addUser)
  router.post('/edit_user', controller.home.editUser)
  router.post('/delete_user', controller.home.deleteUser)

  router.post('/api/user/register', controller.user.register)
  router.post('/api/user/login', controller.user.login)
  router.post('/api/user/test', _jwt, controller.user.test)
  router.post('/api/user/getUserInfo', _jwt, controller.user.getUserInfo)
  router.post('/api/user/editUserInfo', _jwt, controller.user.editUserInfo)
  router.post('/api/upload', controller.upload.upload)

  router.post('/api/bills/add', controller.bills.add)
  router.post('/api/bills/list', _jwt, controller.bills.list)
  router.post('/api/bills/detail', _jwt, controller.bills.detail)
  router.post('/api/bills/update', _jwt, controller.bills.update)
  router.post('/api/bills/delete', _jwt, controller.bills.delete)
};
