class DeleteUserCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    return await this.authService.deleteUser(command.id);
  }
}
module.exports = DeleteUserCommandHandler;
