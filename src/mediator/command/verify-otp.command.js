class VerifyOtpCommand {
  constructor({ email, user_id, otp_code }) {
    this.email = email;
    this.user_id = user_id;
    this.otp_code = otp_code;
  }
}
module.exports = VerifyOtpCommand;