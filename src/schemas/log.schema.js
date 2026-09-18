const { z } = require('zod');

const getLogsSchema = z.object({
  page: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  limit: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  search: z.string().optional()
});

const logEventSchema = z.object({
  application_id: z.string({ required_error: 'Application ID is required' }),
  action_text: z.string({ required_error: 'Action text is required' }),
  userId: z.string(),
  userName: z.string()
});

module.exports = {
  getLogsSchema,
  logEventSchema
};
