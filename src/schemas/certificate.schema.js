const { z } = require('zod');

const getCertificatesSchema = z.object({
  page: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  limit: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  status: z.string().optional(),
  search: z.string().optional(),
  companyId: z.string().optional(),
  isCompany: z.boolean().optional()
});

const getCertificateByIdSchema = z.object({
  id: z.string({ required_error: 'Certificate ID is required' }),
});

const getCertificateByApplicationIdSchema = z.object({
  applicationId: z.string({ required_error: 'Application ID is required' }),
});

const payCertificateSchema = z.object({
  id: z.string({ required_error: 'Certificate ID is required' }),
});

const payCertificateByApplicationSchema = z.object({
  applicationId: z.string({ required_error: 'Application ID is required' }),
});

const viewCertificateHtmlSchema = z.object({
  id: z.string({ required_error: 'Certificate ID is required' }),
});

const suspendCertificateSchema = z.object({
  id: z.string({ required_error: 'Certificate ID is required' }),
});

module.exports = {
  getCertificatesSchema,
  getCertificateByIdSchema,
  getCertificateByApplicationIdSchema,
  payCertificateSchema,
  payCertificateByApplicationSchema,
  viewCertificateHtmlSchema,
  suspendCertificateSchema
};
