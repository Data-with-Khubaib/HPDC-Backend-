// src/services/dashboard.service.js

class DashboardService {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async getCompanyMetrics(companyId) {
    const metrics = await this.dashboardRepository.getCompanyDashboardMetrics(companyId);
    // metrics is always an object now (never null), so no 404 needed
    return metrics;
  }

  async getAdminMetrics() {
    const metrics = await this.dashboardRepository.getAdminDashboardMetrics();
    return metrics;
  }
}

module.exports = DashboardService;
