class LoginCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    return await this.authService.login(command.email, command.password);
  }
}
module.exports = LoginCommandHandler;