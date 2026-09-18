const { z } = require('zod');

const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .toLowerCase()
        .email({ message: "Please provide a Valid email address" }),

    password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters' })
});

const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  phone_number: z
    .string()
    .trim()
    .regex(/^[0-9+]+$/, { message: 'Phone number can only contain digits or +' })
    .optional()
    .or(z.literal('')), // empty string bhi allow karega
  role: z
    .enum(['COMPANY', 'ADMIN', 'CONSULTANT'], {
      errorMap: () => ({ message: 'Role must be COMPANY, ADMIN, or CONSULTANT' }),
    })
    .default('COMPANY'),
  // Company specific fields (optional if individual user, required if company)
  company_name: z.string().trim().optional(),
  country: z.string().trim().default('Saudi Arabia'),
  sector: z.string().trim().default('General'),
  registration_number: z.string().trim().optional(),
  contact_person: z.string().trim().optional(),
});
// ==========================================
// 3. VERIFY OTP SCHEMA
// Route: POST /auth/verify-otp
// Expects: { email OR user_id, otp_code }
// ==========================================
const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email().optional(),
  user_id: z.string().trim().optional(),
  otp_code: z
    .string({ required_error: 'OTP code is required' })
    .trim()
    .length(6, { message: 'OTP must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'OTP must contain only numbers' }),
}).refine(data => data.email || data.user_id, {
  message: 'Either email or user_id must be provided',
  path: ['email'],
});

const resendOtpSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().toLowerCase().email(),
});

const refreshSchema = z.object({
  refresh_token: z.string({ required_error: 'Refresh token is required' }).trim(),
});

const changePasswordSchema = z.object({
  old_password: z.string({ required_error: 'Old password is required' }),
  new_password: z.string({ required_error: 'New password is required' }).min(6),
});

const getUsersSchema = z.object({
  role: z.enum(['COMPANY', 'ADMIN', 'CONSULTANT']).optional(),
  search: z.string().trim().optional(),
});

const updateUserSchema = z.object({
  id: z.string({ required_error: 'User ID is required' }),
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  phone_number: z.string().trim().regex(/^[0-9+]+$/).optional().or(z.literal('')),
  role: z.enum(['COMPANY', 'ADMIN', 'CONSULTANT']).optional(),
  is_active: z.boolean().optional()
});

const deleteUserSchema = z.object({
  id: z.string({ required_error: 'User ID is required' })
});

module.exports = {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  refreshSchema,
  changePasswordSchema,
  getUsersSchema,
  updateUserSchema,
  deleteUserSchema
};
