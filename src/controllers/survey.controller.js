// src/controllers/survey.controller.js

const GetSurveysQuery = require('../mediator/command/get-surveys.query');
const GetSurveyByIdQuery = require('../mediator/command/get-survey-by-id.query');
const SubmitAnswersCommand = require('../mediator/command/submit-answers.command');
const GetAnswersByApplicationQuery = require('../mediator/command/get-answers-by-application.query');

class SurveyController {
  constructor(mediator) {
    this.mediator = mediator;
  }

  async getAll(request, reply) {
    try {
      const query = new GetSurveysQuery();
      const surveys = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: surveys });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getById(request, reply) {
    try {
      const query = new GetSurveyByIdQuery(request.params.id);
      const survey = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: survey });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async submitAnswers(request, reply) {
    try {
      const command = new SubmitAnswersCommand(request.body.answers);
      const result = await this.mediator.send(command);
      return reply.code(201).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  async getAnswersByApplication(request, reply) {
    try {
      const query = new GetAnswersByApplicationQuery(request.params.applicationId);
      const answers = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: answers });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }
}

module.exports = SurveyController;
