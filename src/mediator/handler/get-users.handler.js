class GetUsersQueryHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(query) {
    const users = await this.authService.getUsers({ role: query.role, search: query.search });
    return { success: true, data: users };
  }
}
module.exports = GetUsersQueryHandler;
