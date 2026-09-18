// src/routes/survey.routes.js
const { authenticate } = require('../middlewares/auth');

async function surveyRoutes(fastify, { surveyController }) {
  // List all surveys with sections and questions
  fastify.get('/surveys', {
    preHandler: [authenticate],
  }, (req, reply) => surveyController.getAll(req, reply));

  // Get single survey by ID
  fastify.get('/surveys/:id', {
    preHandler: [authenticate],
  }, (req, reply) => surveyController.getById(req, reply));

  // Submit answers
  fastify.post('/surveys/answers', {
    preHandler: [authenticate],
  }, (req, reply) => surveyController.submitAnswers(req, reply));

  // Get answers by application
  fastify.get('/surveys/answers/application/:applicationId', {
    preHandler: [authenticate],
  }, (req, reply) => surveyController.getAnswersByApplication(req, reply));
}

module.exports = surveyRoutes;
