class SubmitApplicationCommandHandler {
  constructor(applicationService) {
    this.applicationService = applicationService;
  }
  async handle(command) {
    return await this.applicationService.submitFull(command.data, command.user);
  }
}
module.exports = SubmitApplicationCommandHandler;
