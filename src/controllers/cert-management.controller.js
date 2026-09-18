// src/controllers/cert-management.controller.js

const GetCertTypesQuery = require('../mediator/command/get-cert-types.query');
const GetCertTypeByIdQuery = require('../mediator/command/get-cert-type-by-id.query');
const CreateCertTypeCommand = require('../mediator/command/create-cert-type.command');
const UpdateCertTypeCommand = require('../mediator/command/update-cert-type.command');
const DeleteCertTypeCommand = require('../mediator/command/delete-cert-type.command');

class CertManagementController {
  constructor(mediator) {
    this.mediator = mediator;
  }

  async getAll(request, reply) {
    try {
      const { page, limit, status, search } = request.query;
      const statusBool = status === 'true' ? true : status === 'false' ? false : undefined;
      const query = new GetCertTypesQuery({ page, limit, status: statusBool, search });
      const result = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getById(request, reply) {
    try {
      const query = new GetCertTypeByIdQuery(request.params.id);
      const item = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: item });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async create(request, reply) {
    try {
      const command = new CreateCertTypeCommand(request.body);
      const item = await this.mediator.send(command);
      return reply.code(201).send({ success: true, data: item });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async update(request, reply) {
    try {
      const command = new UpdateCertTypeCommand(request.params.id, request.body);
      const item = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: item });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async delete(request, reply) {
    try {
      const command = new DeleteCertTypeCommand(request.params.id);
      await this.mediator.send(command);
      return reply.code(200).send({ success: true, message: 'Certificate type deleted' });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }
}

module.exports = CertManagementController;
