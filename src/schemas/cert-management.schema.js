const { z } = require('zod');

const getCertTypesSchema = z.object({
  page: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  limit: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  status: z.boolean().optional(),
  search: z.string().optional()
});

const getCertTypeByIdSchema = z.object({
  id: z.string({ required_error: 'ID is required' }),
});

const createCertTypeSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  is_active: z.boolean().optional(),
  validity_years: z.number().int().positive().optional()
}).passthrough();

const updateCertTypeSchema = z.object({
  id: z.string({ required_error: 'ID is required' }),
  data: z.object({}).passthrough() // we just let updates pass through, could be strict
});

const deleteCertTypeSchema = z.object({
  id: z.string({ required_error: 'ID is required' }),
});

module.exports = {
  getCertTypesSchema,
  getCertTypeByIdSchema,
  createCertTypeSchema,
  updateCertTypeSchema,
  deleteCertTypeSchema
};
