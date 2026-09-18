const { z } = require('zod');

const getCompaniesSchema = z.object({
  page: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  limit: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  search: z.string().optional()
});

const getCompanyByIdSchema = z.object({
  id: z.string({ required_error: 'Company ID is required' }),
});

const getMyCompanySchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }),
});

const getCompanyDetailSchema = z.object({
  applicationId: z.string({ required_error: 'Application ID is required' }),
});

const createCompanyDetailSchema = z.object({
  data: z.object({}).passthrough()
});

module.exports = {
  getCompaniesSchema,
  getCompanyByIdSchema,
  getMyCompanySchema,
  getCompanyDetailSchema,
  createCompanyDetailSchema
};
