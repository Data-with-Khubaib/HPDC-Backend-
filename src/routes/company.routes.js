// src/routes/company.routes.js
const { authenticate, authorize } = require('../middlewares/auth');
const { paginationQuery } = require('../entity/schemas');

async function companyRoutes(fastify, { companyController }) {
  // List all companies — ADMIN only
  fastify.get('/companies', {
    preHandler: [authenticate, authorize('ADMIN')],
    schema: paginationQuery,
  }, (req, reply) => companyController.getAll(req, reply));

  // Get my company — COMPANY users
  fastify.get('/companies/me', {
    preHandler: [authenticate, authorize('COMPANY')],
  }, (req, reply) => companyController.getMyCompany(req, reply));

  // Get company by ID
  fastify.get('/companies/:id', {
    preHandler: [authenticate],
  }, (req, reply) => companyController.getById(req, reply));

  // Get company detail (apply wizard data) by application ID
  fastify.get('/companies/detail/:applicationId', {
    preHandler: [authenticate],
  }, (req, reply) => companyController.getCompanyDetail(req, reply));

  // Create company detail (apply wizard submit)
  fastify.post('/companies/detail', {
    preHandler: [authenticate, authorize('COMPANY')],
  }, (req, reply) => companyController.createCompanyDetail(req, reply));
}

module.exports = companyRoutes;
