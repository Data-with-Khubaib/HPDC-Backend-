class ViewCertificateHtmlQueryHandler {
  constructor(certificateService) {
    this.certificateService = certificateService;
  }
  async handle(query) {
    return await this.certificateService.generateCertificateHtml(query.id);
  }
}
module.exports = ViewCertificateHtmlQueryHandler;
