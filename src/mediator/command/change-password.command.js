class ChangePasswordCommand {
  constructor({ old_password, new_password }, userId) {
    this.old_password = old_password;
    this.new_password = new_password;
    this.userId = userId;
  }
}
module.exports = ChangePasswordCommand;
