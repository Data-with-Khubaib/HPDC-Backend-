class GetAnswersByApplicationQueryHandler {
  constructor(surveyService) {
    this.surveyService = surveyService;
  }
  async handle(query) {
    return await this.surveyService.getAnswersByApplication(query.applicationId);
  }
}
module.exports = GetAnswersByApplicationQueryHandler;
