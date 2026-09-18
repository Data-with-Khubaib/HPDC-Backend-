class LogEventCommand {
  constructor({ applicationId, actionText, userId, userName }) {
    this.applicationId = applicationId;
    this.actionText = actionText;
    this.userId = userId;
    this.userName = userName;
  }
}
module.exports = LogEventCommand;
