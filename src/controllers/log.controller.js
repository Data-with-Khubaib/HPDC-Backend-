// src/controllers/log.controller.js

const GetLogsQuery = require('../mediator/command/get-logs.query');
const LogEventCommand = require('../mediator/command/log-event.command');

class LogController {
  constructor(mediator) {
    this.mediator = mediator;
  }

  async getAll(request, reply) {
    try {
      const query = new GetLogsQuery(request.query);
      const result = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async logEvent(request, reply) {
    try {
      const { application_id, action_text } = request.body;
      const command = new LogEventCommand({
        applicationId: application_id,
        actionText: action_text,
        userId: request.user.id,
        userName: request.user.name,
      });
      const log = await this.mediator.send(command);
      return reply.code(201).send({ success: true, data: log });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }
}

module.exports = LogController;
