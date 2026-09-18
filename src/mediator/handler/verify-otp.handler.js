class VerifyOtpCommandHandler {
  constructor(authService) {
    this.authService = authService;
  }
  async handle(command) {
    const identifier = command.email || command.user_id;
    return await this.authService.verifyOtp(identifier, command.otp_code);
  }
}
module.exports = VerifyOtpCommandHandler;