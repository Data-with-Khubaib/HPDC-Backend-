class GetSurveysQueryHandler {
  constructor(surveyService) {
    this.surveyService = surveyService;
  }
  async handle(query) {
    return await this.surveyService.getAllSurveys();
  }
}
module.exports = GetSurveysQueryHandler;
