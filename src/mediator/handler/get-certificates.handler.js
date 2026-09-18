class GetCertificatesQueryHandler {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }
  async handle(query) {
    return await this.certificateService.getAll({
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
      search: query.search,
      companyId: query.companyId,
      isCompany: query.isCompany,
    });
  }
}
module.exports = GetCertificatesQueryHandler;
