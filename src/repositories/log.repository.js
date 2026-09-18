// src/repositories/log.repository.js

class LogRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ page = 1, limit = 10, search }) {
    const where = {};
    if (search) {
      where.OR = [
        { user_name: { contains: search, mode: 'insensitive' } },
        { action_text: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Manual log insert — used for events NOT covered by DB triggers
   * (e.g., user login, terms accepted, document viewed).
   */
  async createManualLog({ userId, applicationId, userName, actionText }) {
    return this.prisma.activityLog.create({
      data: {
        user_id: userId,
        application_id: applicationId,
        user_name: userName,
        action_text: actionText,
        created_at: new Date(),
      },
    });
  }
}

module.exports = LogRepository;
