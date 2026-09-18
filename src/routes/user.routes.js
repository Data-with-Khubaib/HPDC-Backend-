// src/routes/user.routes.js
const { authenticate, authorize } = require('../middlewares/auth');

async function userRoutes(fastify, { authController }) {
  fastify.get('/users', {
    preHandler: [authenticate, authorize('ADMIN')],
  }, (req, reply) => authController.getUsers(req, reply));

  fastify.put('/users/:id', {
    preHandler: [authenticate, authorize('ADMIN')],
  }, (req, reply) => authController.updateUser(req, reply));

  fastify.delete('/users/:id', {
    preHandler: [authenticate, authorize('ADMIN')],
  }, (req, reply) => authController.deleteUser(req, reply));

  fastify.post('/users', {
    preHandler: [authenticate, authorize('ADMIN')],
  }, (req, reply) => authController.register(req, reply));
}

module.exports = userRoutes;
