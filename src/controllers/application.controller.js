// src/controllers/application.controller.js

const SubmitApplicationCommand = require('../mediator/command/submit-application.command');
const GetApplicationsQuery = require('../mediator/command/get-applications.query');
const GetApplicationByIdQuery = require('../mediator/command/get-application-by-id.query');
const AdminTakeActionCommand = require('../mediator/command/admin-take-action.command');
const CompanyTakeActionCommand = require('../mediator/command/company-take-action.command');
const UpdateApplicationStatusCommand = require('../mediator/command/update-application-status.command');
const GetApplicationDocumentsQuery = require('../mediator/command/get-application-documents.query');

class ApplicationController {
  constructor(mediator) {
    this.mediator = mediator;
  }

  async submit(request, reply) {
    try {
      const command = new SubmitApplicationCommand(request.body, request.user);
      const result = await this.mediator.send(command);
      return reply.code(201).send({ success: true, data: result });
    } catch (err) {
      request.log.error(err);
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getAll(request, reply) {
    try {
      const companyId = request.user.role === 'COMPANY' ? request.user.companyId : undefined;
      const query = new GetApplicationsQuery({
        ...request.query,
        companyId
      });
      const result = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getById(request, reply) {
    try {
      const query = new GetApplicationByIdQuery(request.params.id);
      const application = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: application });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async adminTakeAction(request, reply) {
    try {
      const command = new AdminTakeActionCommand({
        id: request.params.id,
        action: request.body.action,
        reason: request.body.reason,
        adminId: request.user.id
      });
      const result = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async companyTakeAction(request, reply) {
    try {
      const command = new CompanyTakeActionCommand({
        id: request.params.id,
        companyId: request.user.id,
        comment_text: request.body.comment_text,
        document_url: request.body.document_url,
        document_name: request.body.document_name
      });
      const result = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async updateStatus(request, reply) {
    try {
      const command = new UpdateApplicationStatusCommand({
        id: request.params.id,
        status: request.body.status,
        reason: request.body.reason,
        adminId: request.user.id
      });
      const result = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getDocuments(request, reply) {
    try {
      const query = new GetApplicationDocumentsQuery(request.params.id);
      const docs = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: docs });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }
}

module.exports = ApplicationController;
