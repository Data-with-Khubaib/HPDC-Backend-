class AdminTakeActionCommandHandler {
  constructor(applicationService) {
    this.applicationService = applicationService;
  }
  async handle(command) {
    return await this.applicationService.adminTakeAction(
      command.id,
      command.action,
      command.reason,
      command.adminId
    );
  }
}
module.exports = AdminTakeActionCommandHandler;
