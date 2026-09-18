// src/routes/certificate.routes.js
const { authenticate, authorize } = require('../middlewares/auth');

async function certificateRoutes(fastify, { certificateController }) {
  // List certificates (filtered by paid=true for companies, all for admin)
  fastify.get('/certificates', {
    preHandler: [authenticate],
  }, (req, reply) => certificateController.getAll(req, reply));

  // Get certificate by ID
  fastify.get('/certificates/:id', {
    preHandler: [authenticate],
  }, (req, reply) => certificateController.getById(req, reply));

  // Get certificate HTML by ID
  fastify.get('/certificates/:id/html', {
    preHandler: [authenticate],
  }, (req, reply) => certificateController.viewCertificateHtml(req, reply));

  // Get certificate by application ID
  fastify.get('/applications/:applicationId/certificate', {
    preHandler: [authenticate],
  }, (req, reply) => certificateController.getByApplication(req, reply));

  // Pay certification fee
  fastify.post('/certificates/:id/pay', {
    preHandler: [authenticate, authorize('COMPANY')],
  }, (req, reply) => certificateController.pay(req, reply));

  // Pay certification fee by application ID
  fastify.post('/applications/:applicationId/pay-certificate', {
    preHandler: [authenticate, authorize('COMPANY')],
  }, (req, reply) => certificateController.payByApplication(req, reply));

  // Suspend certificate - ADMIN only
  fastify.patch('/certificates/:id/suspend', {
    preHandler: [authenticate, authorize('ADMIN')],
  }, (req, reply) => certificateController.suspend(req, reply));
}

module.exports = certificateRoutes;
