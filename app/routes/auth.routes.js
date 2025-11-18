const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  console.log('Auth 123routes loaded');
  app.post('/api/auth/login', controller.login);
};
