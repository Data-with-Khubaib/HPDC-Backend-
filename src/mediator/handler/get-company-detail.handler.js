class GetCompanyDetailQueryHandler {
  constructor(companyService) {
    this.companyService = companyService;
  }
  async handle(query) {
    return await this.companyService.getCompanyDetailByAppId(query.applicationId);
  }
}
module.exports = GetCompanyDetailQueryHandler;
