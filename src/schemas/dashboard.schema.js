const { z } = require('zod');

const getDashboardMetricsSchema = z.object({
  role: z.string(),
  companyId: z.string().optional()
});

const getCompanyMetricsSchema = z.object({
  companyId: z.string({ required_error: 'Company ID is required' }),
});

const getAdminMetricsSchema = z.object({});

module.exports = {
  getDashboardMetricsSchema,
  getCompanyMetricsSchema,
  getAdminMetricsSchema
};
