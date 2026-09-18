// src/controllers/company.controller.js

const GetCompaniesQuery = require('../mediator/command/get-companies.query');
const GetCompanyByIdQuery = require('../mediator/command/get-company-by-id.query');
const GetMyCompanyQuery = require('../mediator/command/get-my-company.query');
const GetCompanyDetailQuery = require('../mediator/command/get-company-detail.query');
const CreateCompanyDetailCommand = require('../mediator/command/create-company-detail.command');

class CompanyController {
  constructor(mediator) {
    this.mediator = mediator;
  }

  async getAll(request, reply) {
    try {
      const query = new GetCompaniesQuery(request.query);
      const result = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getById(request, reply) {
    try {
      const query = new GetCompanyByIdQuery(request.params.id);
      const company = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: company });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getMyCompany(request, reply) {
    try {
      const query = new GetMyCompanyQuery(request.user.id);
      const company = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: company });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getCompanyDetail(request, reply) {
    try {
      const query = new GetCompanyDetailQuery(request.params.applicationId);
      const detail = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: detail });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async createCompanyDetail(request, reply) {
    try {
      const command = new CreateCompanyDetailCommand(request.body);
      const detail = await this.mediator.send(command);
      return reply.code(201).send({ success: true, data: detail });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }
}

module.exports = CompanyController;
