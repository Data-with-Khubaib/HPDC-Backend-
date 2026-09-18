class GetMeQueryHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(query) {
    const user = await this.authService.authRepository.findUserById(query.userId);
    return {
      success: true,
      data: this.authService._sanitizeUser(user, user.company),
    };
  }
}
module.exports = GetMeQueryHandler;
