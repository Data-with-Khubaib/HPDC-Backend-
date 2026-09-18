class GetMyCompanyQueryHandler {
  constructor(companyService) {
    this.companyService = companyService;
  }
  async handle(query) {
    return await this.companyService.getByUserId(query.userId);
  }
}
module.exports = GetMyCompanyQueryHandler;
