class GetCertificateByApplicationIdQueryHandler {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }
  async handle(query) {
    return await this.certificateService.getByApplicationId(query.applicationId);
  }
}
module.exports = GetCertificateByApplicationIdQueryHandler;
