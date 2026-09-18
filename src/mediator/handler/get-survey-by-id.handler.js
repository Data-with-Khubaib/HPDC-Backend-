class GetSurveyByIdQueryHandler {
  constructor(surveyService) {
    this.surveyService = surveyService;
  }
  async handle(query) {
    return await this.surveyService.getSurveyById(query.id);
  }
}
module.exports = GetSurveyByIdQueryHandler;
