// src/controllers/dashboard.controller.js

const GetDashboardMetricsQuery = require('../mediator/command/get-dashboard-metrics.query');
const GetCompanyMetricsQuery = require('../mediator/command/get-company-metrics.query');
const GetAdminMetricsQuery = require('../mediator/command/get-admin-metrics.query');

class DashboardController {
  constructor(mediator) {
    this.mediator = mediator;
  }

  async getMetrics(request, reply) {
    try {
      const query = new GetDashboardMetricsQuery({
        role: request.user.role,
        companyId: request.user.companyId,
      });
      const metrics = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: metrics });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getCompanyMetrics(request, reply) {
    try {
      const companyId = request.params.companyId === 'me' ? request.user.companyId : request.params.companyId;
      const query = new GetCompanyMetricsQuery(companyId);
      const metrics = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: metrics });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getAdminMetrics(request, reply) {
    try {
      const query = new GetAdminMetricsQuery();
      const metrics = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: metrics });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }
}

module.exports = DashboardController;
