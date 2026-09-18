class RefreshCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    return await this.authService.refreshToken(command.refresh_token);
  }
}
module.exports = RefreshCommandHandler;
