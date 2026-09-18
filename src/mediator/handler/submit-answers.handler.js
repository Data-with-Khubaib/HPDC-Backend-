class SubmitAnswersCommandHandler {
  constructor(surveyService) {
    this.surveyService = surveyService;
  }
  async handle(command) {
    return await this.surveyService.submitAnswers(command.answers);
  }
}
module.exports = SubmitAnswersCommandHandler;
