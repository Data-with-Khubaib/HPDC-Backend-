class CreateCompanyDetailCommandHandler {
  constructor(companyService) {
    this.companyService = companyService;
  }
  async handle(command) {
    return await this.companyService.createCompanyDetail(command.data);
  }
}
module.exports = CreateCompanyDetailCommandHandler;
