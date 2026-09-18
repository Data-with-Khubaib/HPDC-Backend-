class GetAdminMetricsQueryHandler {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }
  async handle(query) {
    return await this.dashboardService.getAdminMetrics();
  }
}
module.exports = GetAdminMetricsQueryHandler;
