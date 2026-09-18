const { z } = require('zod');

const getSurveysSchema = z.object({});

const getSurveyByIdSchema = z.object({
  id: z.string({ required_error: 'Survey ID is required' }),
});

const submitAnswersSchema = z.object({
  answers: z.array(z.any())
});

const getAnswersByApplicationSchema = z.object({
  applicationId: z.string({ required_error: 'Application ID is required' }),
});

module.exports = {
  getSurveysSchema,
  getSurveyByIdSchema,
  submitAnswersSchema,
  getAnswersByApplicationSchema
};
