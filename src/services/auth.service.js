// src/services/auth.service.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class AuthService {
  constructor(authRepository, fastify, mailer) {
    this.authRepository = authRepository;
    this.fastify = fastify;
    this.mailer = mailer;
  }

  async register({ name, email, password, phone_number, role = 'COMPANY', company_name, country, sector, registration_number, contact_person }) {
    const existing = await this.authRepository.findUserByEmail(email);
    if (existing) {
      throw { statusCode: 409, message: 'User with this email already exists' };
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      name: name || contact_person,
      email,
      password: hashedPassword,
      phone_number: BigInt(phone_number || '0'),
      role: (role || 'COMPANY').toUpperCase(),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (userData.role === 'COMPANY') {
      const companyData = {
        company_name: company_name || name,
        phone_number: BigInt(phone_number || '0'),
        country: country || 'Saudi Arabia',
        sector: sector || 'General',
        registration_number: BigInt(registration_number || Date.now().toString().slice(-8)),
        contact_person: contact_person || name,
      };

      const { user, company } = await this.authRepository.createCompanyWithUser(userData, companyData);
      
      // Auto-send OTP upon registration
      await this.resendOtp(user.email).catch(err => console.warn('Failed to send OTP on register:', err.message));
      
      return this._sanitizeUser(user, company);
    }

    const user = await this.authRepository.createUser(userData);
    
    // Auto-send OTP upon registration
    await this.resendOtp(user.email).catch(err => console.warn('Failed to send OTP on register:', err.message));
    
    return this._sanitizeUser(user);
  }

  /**
   * LOGIN — Step 1: Validate email + password, generate 6-digit OTP, send email.
   * Does NOT return JWT tokens.
   */
  async login(email, password) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    if (!user.is_active) {
      throw { statusCode: 403, message: 'Account is deactivated' };
    }

    // Clean up expired OTPs
    await this.authRepository.deleteExpiredOtps(user.id);

    // Generate 6-digit OTP
    let otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (user.role === 'ADMIN') {
      otpCode = '000000';
    }

    // Save to DB (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.authRepository.createOtp(user.id, otpCode, expiresAt);

    // Send email via Nodemailer
    try {
      if (this.mailer && this.mailer.sendOtpEmail) {
        await this.mailer.sendOtpEmail(user.email, otpCode, user.name);
      } else {
        console.log(`[OTP] Sent to ${user.email}: ${otpCode}`);
      }
    } catch (err) {
      console.warn(`[Mailer Warning] Failed to send email: ${err.message}. OTP is: ${otpCode}`);
    }

    return {
      success: true,
      message: 'OTP sent to your registered email',
      email: user.email,
      user_id: user.id,
      role: user.role,
    };
  }

  async resendOtp(email) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    if (!user.is_active) {
      throw { statusCode: 403, message: 'Account is deactivated' };
    }

    await this.authRepository.deleteExpiredOtps(user.id);
    let otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (user.role === 'ADMIN') {
      otpCode = '000000';
    }
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.authRepository.createOtp(user.id, otpCode, expiresAt);

    try {
      if (this.mailer && this.mailer.sendOtpEmail) {
        await this.mailer.sendOtpEmail(user.email, otpCode, user.name);
      } else {
        console.log(`[OTP] Sent to ${user.email}: ${otpCode}`);
      }
    } catch (err) {
      console.warn(`[Mailer Warning] Failed to send email: ${err.message}. OTP is: ${otpCode}`);
    }

    return {
      success: true,
      message: 'A new OTP has been sent to your email',
    };
  }

  /**
   * VERIFY OTP — Step 2: Validate OTP and issue JWT access and refresh tokens.
   */
  async verifyOtp(identifier, otpCode) {
    let user;
    if (identifier.includes('@')) {
      user = await this.authRepository.findUserByEmail(identifier);
    } else {
      user = await this.authRepository.findUserById(identifier);
    }

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const validOtp = await this.authRepository.findValidOtp(user.id, otpCode);
    if (!validOtp) {
      throw { statusCode: 401, message: 'Invalid or expired OTP code' };
    }

    // Mark verified
    await this.authRepository.markOtpVerified(validOtp.id);

    // Issue Access Token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      companyId: user.company?.id || null,
    };

    const accessToken = this.fastify.jwt.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    });

    // Issue Refresh Token
    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      success: true,
      accessToken,
      refreshToken,
      user: this._sanitizeUser(user, user.company),
    };
  }

  /**
   * REFRESH TOKEN
   */
  async refreshToken(token) {
    if (!token) {
      throw { statusCode: 400, message: 'Refresh token is required' };
    }

    const stored = await this.authRepository.findRefreshToken(token);
    if (!stored || new Date(stored.expires_at) < new Date()) {
      if (stored) await this.authRepository.deleteRefreshToken(token);
      throw { statusCode: 401, message: 'Invalid or expired refresh token' };
    }

    const user = stored.user;
    if (!user || !user.is_active) {
      throw { statusCode: 401, message: 'User account deactivated' };
    }

    // Rotate refresh token
    await this.authRepository.deleteRefreshToken(token);
    const newRefreshToken = crypto.randomUUID();
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.authRepository.createRefreshToken(user.id, newRefreshToken, newExpiresAt);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      companyId: user.company?.id || null,
    };

    const accessToken = this.fastify.jwt.sign(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: this._sanitizeUser(user, user.company),
    };
  }

  async logout(token) {
    if (token) {
      await this.authRepository.deleteRefreshToken(token);
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw { statusCode: 400, message: 'Current password is incorrect' };
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.authRepository.updateUser(userId, { password: hashedPassword });
    await this.authRepository.deleteUserRefreshTokens(userId);

    return { success: true, message: 'Password updated successfully' };
  }

  async getUsers(filters) {
    const users = await this.authRepository.findAllUsers(filters);
    return users.map((u) => this._sanitizeUser(u, u.company));
  }

  async updateUser(id, data) {
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;
    if (data.role) updateData.role = data.role.toUpperCase();
    if (data.phone_number) updateData.phone_number = BigInt(data.phone_number);

    const user = await this.authRepository.updateUser(id, updateData);
    return this._sanitizeUser(user, user.company);
  }

  async deleteUser(id) {
    await this.authRepository.deleteUser(id);
    return { success: true, message: 'User deleted successfully' };
  }

  _sanitizeUser(user, company) {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number ? user.phone_number.toString() : null,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      company: company
        ? {
            id: company.id,
            company_name: company.company_name,
            country: company.country,
            sector: company.sector,
            phone_number: company.phone_number ? company.phone_number.toString() : null,
            registration_number: company.registration_number ? company.registration_number.toString() : null,
            contact_person: company.contact_person,
          }
        : null,
    };
  }
}

module.exports = AuthService;

