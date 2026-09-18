class CreateCertTypeCommandHandler {
  constructor(certManagementService) {
    this.certManagementService = certManagementService;
  }
  async handle(command) {
    return await this.certManagementService.create(command.data);
  }
}
module.exports = CreateCertTypeCommandHandler;
