// src/repositories/dashboard.repository.js

class DashboardRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Company Dashboard Metrics - computed via Prisma aggregate queries
   * Replaces the missing get_dashboard_metrics() stored procedure
   */
  async getCompanyDashboardMetrics(companyId) {
    const [
      totalApplications,
      pendingCount,
      underReviewCount,
      approvedCount,
      rejectedCount,
      conditionalCount,
      activeCertificates,
      suspendedCertificates,
      expiredCertificates,
      withdrawnCertificates,
    ] = await Promise.all([
      this.prisma.application.count({ where: { company_id: companyId } }),
      this.prisma.application.count({ where: { company_id: companyId, status: { in: ['pending', 'Pending', 'PENDING', 'pending_payment'] } } }),
      this.prisma.application.count({ where: { company_id: companyId, status: { in: ['under_review', 'assessment_schedule', 'Under Review'] } } }),
      this.prisma.application.count({ where: { company_id: companyId, status: { in: ['approved', 'Approved', 'APPROVED'] } } }),
      this.prisma.application.count({ where: { company_id: companyId, status: { in: ['rejected', 'Rejected', 'REJECTED'] } } }),
      this.prisma.application.count({ where: { company_id: companyId, status: { in: ['conditional_approve', 'CONDITIONALLY_APPROVED'] } } }),
      this.prisma.certificate.count({ where: { company_id: companyId, status: { in: ['active', 'Active', 'valid'] } } }),
      this.prisma.certificate.count({ where: { company_id: companyId, status: { in: ['suspended', 'Suspended'] } } }),
      this.prisma.certificate.count({ where: { company_id: companyId, status: { in: ['expired', 'Expired'] } } }),
      this.prisma.certificate.count({ where: { company_id: companyId, status: { in: ['withdrawn', 'Withdrawn'] } } }),
    ]);

    return {
      total_applications: totalApplications,
      pending_count: pendingCount,
      under_review_count: underReviewCount,
      approved_count: approvedCount,
      rejected_count: rejectedCount,
      conditional_count: conditionalCount,
      active_certificates: activeCertificates,
      suspended_certificates: suspendedCertificates,
      expired_certificates: expiredCertificates,
      withdrawn_certificates: withdrawnCertificates,
    };
  }

  /**
   * Admin Dashboard Metrics - computed via Prisma aggregate queries
   * Replaces the missing get_admin_dashboard_metrics() stored procedure
   */
  async getAdminDashboardMetrics() {
    const [
      totalApplications,
      pendingCount,
      scheduledApplications,
      approvedCount,
      rejectedCount,
      conditionalCount,
      activeCertificates,
      suspendedCertificates,
      expiredCertificates,
      withdrawnCertificates,
      totalCompanies,
    ] = await Promise.all([
      this.prisma.application.count(),
      this.prisma.application.count({ where: { status: { in: ['pending', 'Pending', 'PENDING', 'pending_payment'] } } }),
      this.prisma.application.count({ where: { status: { in: ['assessment_schedule', 'under_review'] } } }),
      this.prisma.application.count({ where: { status: { in: ['approved', 'Approved', 'APPROVED'] } } }),
      this.prisma.application.count({ where: { status: { in: ['rejected', 'Rejected', 'REJECTED'] } } }),
      this.prisma.application.count({ where: { status: { in: ['conditional_approve', 'CONDITIONALLY_APPROVED'] } } }),
      this.prisma.certificate.count({ where: { status: { in: ['active', 'Active', 'valid'] } } }),
      this.prisma.certificate.count({ where: { status: { in: ['suspended', 'Suspended'] } } }),
      this.prisma.certificate.count({ where: { status: { in: ['expired', 'Expired'] } } }),
      this.prisma.certificate.count({ where: { status: { in: ['withdrawn', 'Withdrawn'] } } }),
      this.prisma.company.count(),
    ]);

    return {
      total_applications: totalApplications,
      pending_count: pendingCount,
      scheduled_applications: scheduledApplications,
      approved_count: approvedCount,
      rejected_count: rejectedCount,
      conditional_count: conditionalCount,
      active_certificates: activeCertificates,
      suspended_certificates: suspendedCertificates,
      expired_certificates: expiredCertificates,
      withdrawn_certificates: withdrawnCertificates,
      total_companies: totalCompanies,
    };
  }
}

module.exports = DashboardRepository;
