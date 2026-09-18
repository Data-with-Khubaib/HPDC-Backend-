class PayCertificateByApplicationCommandHandler {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }
  async handle(command) {
    return await this.certificateService.payByApplicationId(command.applicationId);
  }
}
module.exports = PayCertificateByApplicationCommandHandler;
