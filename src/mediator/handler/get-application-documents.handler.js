class GetApplicationDocumentsQueryHandler {
  constructor(applicationService) {
    this.applicationService = applicationService;
  }
  async handle(query) {
    return await this.applicationService.getDocuments(query.id);
  }
}
module.exports = GetApplicationDocumentsQueryHandler;
