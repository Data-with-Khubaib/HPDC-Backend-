// src/services/survey.service.js

class SurveyService {
  constructor(surveyRepository) {
    this.surveyRepository = surveyRepository;
  }

  async getAllSurveys() {
    return this.surveyRepository.findAllSurveys();
  }

  async getSurveyById(id) {
    const survey = await this.surveyRepository.findSurveyById(id);
    if (!survey) {
      throw { statusCode: 404, message: 'Survey not found' };
    }
    return survey;
  }

  async submitAnswers(answers) {
    if (!Array.isArray(answers) || answers.length === 0) {
      throw { statusCode: 400, message: 'Answers array is required' };
    }
    return this.surveyRepository.submitAnswers(answers);
  }

  async getAnswersByApplication(applicationId) {
    return this.surveyRepository.findAnswersByApplication(applicationId);
  }

  async getAnswersByCompany(companyId) {
    return this.surveyRepository.findAnswersByCompany(companyId);
  }
}

module.exports = SurveyService;
