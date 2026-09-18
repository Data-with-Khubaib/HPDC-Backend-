class GetCompanyMetricsQueryHandler {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }
  async handle(query) {
    if (!query.companyId) {
      return {
        total_applications: 0,
        approved_count: 0,
        pending_count: 0,
        rejected_count: 0,
        under_review_count: 0,
        active_certificates: 0,
        suspended_certificates: 0,
      };
    }
    return await this.dashboardService.getCompanyMetrics(query.companyId);
  }
}
module.exports = GetCompanyMetricsQueryHandler;
