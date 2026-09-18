// src/routes/cert-management.routes.js
const { authenticate, authorize } = require('../middlewares/auth');
const { createCertificateManagementSchema, paginationQuery } = require('../entity/schemas');

async function certManagementRoutes(fastify, { certManagementController }) {
  // Company-accessible: list active cert types for payment page
  fastify.get('/certificate-management/active', {
    preHandler: [authenticate],
  }, async (req, reply) => {
    try {
      const prisma = require('../config/prisma');
      const types = await prisma.certificateManagement.findMany({
        where: { status: true },
        orderBy: { duration: 'asc' },
      });
      const serialized = types.map(t => ({
        ...t,
        application_fee: t.application_fee.toString(),
        certificate_fee: t.certificate_fee.toString(),
      }));
      return reply.code(200).send({ success: true, data: serialized });
    } catch (err) {
      return reply.code(500).send({ success: false, error: err.message });
    }
  });

  // All routes below are ADMIN only
  const adminGuard = [authenticate, authorize('ADMIN')];

  // List all certificate types
  fastify.get('/certificate-management', {
    preHandler: adminGuard,
    schema: paginationQuery,
  }, (req, reply) => certManagementController.getAll(req, reply));

  // Get single certificate type
  fastify.get('/certificate-management/:id', {
    preHandler: adminGuard,
  }, (req, reply) => certManagementController.getById(req, reply));

  // Create certificate type
  fastify.post('/certificate-management', {
    preHandler: adminGuard,
    schema: createCertificateManagementSchema,
  }, (req, reply) => certManagementController.create(req, reply));

  // Update certificate type
  fastify.put('/certificate-management/:id', {
    preHandler: adminGuard,
  }, (req, reply) => certManagementController.update(req, reply));

  // Delete certificate type
  fastify.delete('/certificate-management/:id', {
    preHandler: adminGuard,
  }, (req, reply) => certManagementController.delete(req, reply));
}

module.exports = certManagementRoutes;

