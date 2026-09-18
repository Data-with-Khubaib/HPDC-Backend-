class GetApplicationsQueryHandler {
  constructor(applicationService) {
    this.applicationService = applicationService;
  }
  async handle(query) {
    return await this.applicationService.getAll({
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
      search: query.search,
      companyId: query.companyId,
    });
  }
}
module.exports = GetApplicationsQueryHandler;
