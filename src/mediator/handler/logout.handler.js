class LogoutCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    return await this.authService.logout(command.refresh_token);
  }
}
module.exports = LogoutCommandHandler;
