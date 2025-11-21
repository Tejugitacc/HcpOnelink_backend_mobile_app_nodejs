const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  console.log('Auth routes loaded');
  app.post('/api/auth/login', controller.login);
};
