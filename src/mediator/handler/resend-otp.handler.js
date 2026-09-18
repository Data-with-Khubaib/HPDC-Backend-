class ResendOtpCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    return await this.authService.resendOtp(command.email);
  }
}
module.exports = ResendOtpCommandHandler;
