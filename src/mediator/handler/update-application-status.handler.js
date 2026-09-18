class UpdateApplicationStatusCommandHandler {
  constructor(applicationService) {
    this.applicationService = applicationService;
  }
  async handle(command) {
    return await this.applicationService.adminTakeAction(
      command.id,
      command.status, // mapping status to action arg
      command.reason,
      command.adminId
    );
  }
}
module.exports = UpdateApplicationStatusCommandHandler;
