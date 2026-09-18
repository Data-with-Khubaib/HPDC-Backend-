class GetCertTypeByIdQueryHandler {
  constructor(certManagementService) {
    this.certManagementService = certManagementService;
  }
  async handle(query) {
    return await this.certManagementService.getById(query.id);
  }
}
module.exports = GetCertTypeByIdQueryHandler;
