const { z } = require('zod');

const submitApplicationSchema = z.object({
  data: z.object({}).passthrough().optional(),
  user: z.object({}).passthrough().optional()
}).passthrough();

const getApplicationsSchema = z.object({
  page: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  limit: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  status: z.string().optional(),
  search: z.string().optional(),
  companyId: z.string().optional()
});

const getApplicationByIdSchema = z.object({
  id: z.string({ required_error: 'Application ID is required' }),
});

const adminTakeActionSchema = z.object({
  id: z.string({ required_error: 'Application ID is required' }),
  action: z.string({ required_error: 'Action is required' }),
  reason: z.string().optional(),
  adminId: z.string().optional()
});

const companyTakeActionSchema = z.object({
  id: z.string({ required_error: 'Application ID is required' }),
  companyId: z.string().optional(),
  comment_text: z.string().optional(),
  document_url: z.string().optional(),
  document_name: z.string().optional(),
});

const updateApplicationStatusSchema = z.object({
  id: z.string({ required_error: 'Application ID is required' }),
  status: z.string({ required_error: 'Status is required' }),
  reason: z.string().optional(),
  adminId: z.string().optional()
});

const getApplicationDocumentsSchema = z.object({
  id: z.string({ required_error: 'Application ID is required' }),
});

module.exports = {
  submitApplicationSchema,
  getApplicationsSchema,
  getApplicationByIdSchema,
  adminTakeActionSchema,
  companyTakeActionSchema,
  updateApplicationStatusSchema,
  getApplicationDocumentsSchema
};
