class GetCompanyByIdQueryHandler {
  constructor(companyService) {
    this.companyService = companyService;
  }
  async handle(query) {
    return await this.companyService.getById(query.id);
  }
}
module.exports = GetCompanyByIdQueryHandler;
