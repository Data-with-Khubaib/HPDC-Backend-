// src/routes/application.routes.js
const { authenticate, authorize } = require('../middlewares/auth');

async function applicationRoutes(fastify, { applicationController }) {
  // Submit multi-step application
  fastify.post('/applications', {
    preHandler: [authenticate],
  }, (req, reply) => applicationController.submit(req, reply));

  // List all applications (filtered by company for companies, all for admin)
  fastify.get('/applications', {
    preHandler: [authenticate],
  }, (req, reply) => applicationController.getAll(req, reply));

  // Get application by ID
  fastify.get('/applications/:id', {
    preHandler: [authenticate],
  }, (req, reply) => applicationController.getById(req, reply));

  // Take Action on application
  // Admin: conditional_approve, approve, reject
  // Company: response when conditionally approved
  fastify.post('/applications/:id/take-action', {
    preHandler: [authenticate],
  }, (req, reply) => {
    if (req.user.role === 'ADMIN') {
      return applicationController.adminTakeAction(req, reply);
    } else {
      return applicationController.companyTakeAction(req, reply);
    }
  });

  fastify.patch('/applications/:id/status', {
    preHandler: [authenticate, authorize('ADMIN')],
  }, (req, reply) => applicationController.updateStatus(req, reply));

  fastify.get('/applications/:id/documents', {
    preHandler: [authenticate],
  }, (req, reply) => applicationController.getDocuments(req, reply));
}

module.exports = applicationRoutes;
