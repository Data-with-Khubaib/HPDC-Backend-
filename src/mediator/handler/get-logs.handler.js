class GetLogsQueryHandler {
  constructor(logService) {
    this.logService = logService;
  }
  async handle(query) {
    return await this.logService.getAll({ page: query.page, limit: query.limit, search: query.search });
  }
}
module.exports = GetLogsQueryHandler;
