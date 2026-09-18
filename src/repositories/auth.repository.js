// src/repositories/auth.repository.js

class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findUserByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });
  }

  async findUserById(id) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  async createUser(data) {
    return this.prisma.user.create({ data });
  }

  async createCompanyWithUser(userData, companyData) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: userData });
      const company = await tx.company.create({
        data: {
          ...companyData,
          user_id: user.id,
        },
      });
      return { user, company };
    });
  }

  // --- REFRESH TOKENS ---
  async createRefreshToken(userId, token, expiresAt) {
    return this.prisma.refreshToken.create({
      data: {
        user_id: userId,
        token,
        expires_at: expiresAt,
      },
    });
  }

  async findRefreshToken(token) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { include: { company: true } } },
    });
  }

  async deleteRefreshToken(token) {
    return this.prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  async deleteUserRefreshTokens(userId) {
    return this.prisma.refreshToken.deleteMany({
      where: { user_id: userId },
    });
  }

  // --- OTP CODES ---
  async createOtp(userId, otpCode, expiresAt) {
    return this.prisma.otpCode.create({
      data: {
        user_id: userId,
        otp_code: otpCode,
        expires_at: expiresAt,
      },
    });
  }

  async findValidOtp(userId, otpCode) {
    return this.prisma.otpCode.findFirst({
      where: {
        user_id: userId,
        otp_code: otpCode,
        verified: false,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async markOtpVerified(id) {
    return this.prisma.otpCode.update({
      where: { id },
      data: { verified: true },
    });
  }

  async deleteExpiredOtps(userId) {
    return this.prisma.otpCode.deleteMany({
      where: {
        user_id: userId,
        OR: [
          { expires_at: { lt: new Date() } },
          { verified: true },
        ],
      },
    });
  }

  // --- USER MANAGEMENT (ADMIN) ---
  async findAllUsers({ role, search } = {}) {
    const where = {};
    if (role) where.role = role.toUpperCase();
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.user.findMany({
      where,
      include: { company: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateUser(id, data) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { company: true },
    });
  }

  async deleteUser(id) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}

module.exports = AuthRepository;
