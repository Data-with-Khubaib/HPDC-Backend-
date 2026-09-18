// src/routes/log.routes.js
const { authenticate, authorize } = require('../middlewares/auth');
const { logEventSchema, paginationQuery } = require('../entity/schemas');

async function logRoutes(fastify, { logController }) {
  // Get all activity logs — ADMIN only
  fastify.get('/logs', {
    preHandler: [authenticate, authorize('ADMIN')],
    schema: paginationQuery,
  }, (req, reply) => logController.getAll(req, reply));

  // Manual event log — authenticated users
  fastify.post('/logs/event', {
    preHandler: [authenticate],
    schema: logEventSchema,
  }, (req, reply) => logController.logEvent(req, reply));
}

module.exports = logRoutes;
