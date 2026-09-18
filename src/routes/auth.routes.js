// src/routes/auth.routes.js
const { authenticate } = require('../middlewares/auth');

async function authRoutes(fastify, { authController }) {
  fastify.post('/auth/register', (req, reply) => authController.register(req, reply));
  fastify.post('/auth/login', (req, reply) => authController.login(req, reply));
  fastify.post('/auth/verify-otp', (req, reply) => authController.verifyOtp(req, reply));
  fastify.post('/auth/refresh', (req, reply) => authController.refresh(req, reply));
  fastify.post('/auth/logout', (req, reply) => authController.logout(req, reply));

  fastify.get('/auth/me', { preHandler: [authenticate] }, (req, reply) =>
    authController.me(req, reply)
  );

  fastify.post('/auth/change-password', { preHandler: [authenticate] }, (req, reply) =>
    authController.changePassword(req, reply)
  );
  fastify.post('/auth/resend-otp', (req, reply) => authController.resendOtp(req, reply));
}

module.exports = authRoutes;
