class GetCertTypesQueryHandler {
  constructor(certManagementService) {
    this.certManagementService = certManagementService;
  }
  async handle(query) {
    return await this.certManagementService.getAll({
      page: query.page,
      limit: query.limit,
      status: query.status,
      search: query.search
    });
  }
}
module.exports = GetCertTypesQueryHandler;
