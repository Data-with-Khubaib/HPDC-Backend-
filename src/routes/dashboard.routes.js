// src/routes/dashboard.routes.js
const { authenticate, authorize } = require('../middlewares/auth');

async function dashboardRoutes(fastify, { dashboardController }) {
  // Generic metrics endpoint for current user
  fastify.get('/dashboard/metrics', {
    preHandler: [authenticate],
  }, (req, reply) => dashboardController.getMetrics(req, reply));

  // Company dashboard — authenticated COMPANY users
  fastify.get('/dashboard/company/:companyId', {
    preHandler: [authenticate],
  }, (req, reply) => dashboardController.getCompanyMetrics(req, reply));

  // Admin dashboard — ADMIN only
  fastify.get('/dashboard/admin', {
    preHandler: [authenticate, authorize('ADMIN')],
  }, (req, reply) => dashboardController.getAdminMetrics(req, reply));
}

module.exports = dashboardRoutes;
