class UpdateCertTypeCommandHandler {
  constructor(certManagementService) {
    this.certManagementService = certManagementService;
  }
  async handle(command) {
    return await this.certManagementService.update(command.id, command.data);
  }
}
module.exports = UpdateCertTypeCommandHandler;
