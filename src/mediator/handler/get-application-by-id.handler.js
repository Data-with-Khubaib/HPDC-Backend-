class GetApplicationByIdQueryHandler {
  constructor(applicationService) {
    this.applicationService = applicationService;
  }
  async handle(query) {
    return await this.applicationService.getById(query.id);
  }
}
module.exports = GetApplicationByIdQueryHandler;
