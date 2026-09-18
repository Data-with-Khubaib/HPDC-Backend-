class GetCompaniesQueryHandler {
  constructor(companyService) {
    this.companyService = companyService;
  }
  async handle(query) {
    return await this.companyService.getAll({ page: query.page, limit: query.limit, search: query.search });
  }
}
module.exports = GetCompaniesQueryHandler;
