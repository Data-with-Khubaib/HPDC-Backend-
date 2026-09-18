class PayCertificateCommandHandler {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }
  async handle(command) {
    return await this.certificateService.pay(command.id);
  }
}
module.exports = PayCertificateCommandHandler;
