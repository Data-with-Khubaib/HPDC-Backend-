class LogEventCommandHandler {
  constructor(logService) {
    this.logService = logService;
  }
  async handle(command) {
    return await this.logService.logEvent({
      userId: command.userId,
      applicationId: command.applicationId,
      userName: command.userName,
      actionText: command.actionText,
    });
  }
}
module.exports = LogEventCommandHandler;
