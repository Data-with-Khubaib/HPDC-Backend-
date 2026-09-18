class GetCertificateByIdQueryHandler {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }
  async handle(query) {
    return await this.certificateService.getById(query.id);
  }
}
module.exports = GetCertificateByIdQueryHandler;
