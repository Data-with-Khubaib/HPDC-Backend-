class ChangePasswordCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    return await this.authService.changePassword(command.userId, command.old_password, command.new_password);
  }
}
module.exports = ChangePasswordCommandHandler;
