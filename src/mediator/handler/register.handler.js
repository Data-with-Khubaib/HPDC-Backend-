class RegisterCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    return await this.authService.register(command);
  }
}
module.exports = RegisterCommandHandler;