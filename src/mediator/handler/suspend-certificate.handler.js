class SuspendCertificateCommandHandler {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }
  async handle(command) {
    return await this.certificateService.suspend(command.id);
  }
}
module.exports = SuspendCertificateCommandHandler;
