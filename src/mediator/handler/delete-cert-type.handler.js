class DeleteCertTypeCommandHandler {
  constructor(certManagementService) {
    this.certManagementService = certManagementService;
  }
  async handle(command) {
    return await this.certManagementService.delete(command.id);
  }
}
module.exports = DeleteCertTypeCommandHandler;
