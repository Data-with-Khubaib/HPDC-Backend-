// src/entity/schemas.js
// Fastify JSON Schema definitions for request/response validation

const registerSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password', 'phone_number', 'role'],
    properties: {
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      phone_number: { type: 'number' },
      role: { type: 'string', enum: ['ADMIN', 'COMPANY', 'CONSULTANT'] },
      // Company-specific fields (required when role=COMPANY)
      company_name: { type: 'string' },
      country: { type: 'string' },
      sector: { type: 'string' },
      registration_number: { type: 'number' },
      contact_person: { type: 'string' },
    },
  },
};

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
};

const refreshSchema = {
  body: {
    type: 'object',
    required: ['refresh_token'],
    properties: {
      refresh_token: { type: 'string' },
    },
  },
};

const updateApplicationStatusSchema = {
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['APPROVED', 'REJECTED', 'CONDITIONALLY_APPROVED', 'SCHEDULED', 'UNDER_REVIEW', 'PENDING'] },
      reason: { type: 'string' }, // Required for CONDITIONALLY_APPROVED
    },
  },
};

const submitApplicationSchema = {
  body: {
    type: 'object',
    required: ['company_name', 'company_id'],
    properties: {
      company_name: { type: 'string' },
      company_id: { type: 'string', format: 'uuid' },
      receiver_id: { type: 'number' },
    },
  },
};

const createCommentSchema = {
  body: {
    type: 'object',
    required: ['comment_text'],
    properties: {
      comment_text: { type: 'string', minLength: 1 },
    },
  },
};

const logEventSchema = {
  body: {
    type: 'object',
    required: ['action_text'],
    properties: {
      application_id: { type: 'string', format: 'uuid' },
      action_text: { type: 'string', minLength: 1 },
    },
  },
};

const createCertificateManagementSchema = {
  body: {
    type: 'object',
    required: ['certificate_name', 'duration', 'application_fee', 'certificate_fee', 'status'],
    properties: {
      certificate_name: { type: 'string' },
      duration: { type: 'number' },
      application_fee: { type: 'number' },
      certificate_fee: { type: 'number' },
      status: { type: 'boolean' },
    },
  },
};

const paginationQuery = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      search: { type: 'string' },
      status: { type: 'string' },
    },
  },
};

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateApplicationStatusSchema,
  submitApplicationSchema,
  createCommentSchema,
  logEventSchema,
  createCertificateManagementSchema,
  paginationQuery,
};
