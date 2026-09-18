// src/repositories/comment.repository.js

class CommentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create({ applicationId, senderId, commentText }) {
    return this.prisma.applicationComment.create({
      data: {
        application_id: applicationId,
        sender_id: senderId,
        comment_text: commentText,
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }

  async findById(id) {
    return this.prisma.applicationComment.findUnique({
      where: { id: BigInt(id) },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }

  async update(id, commentText) {
    return this.prisma.applicationComment.update({
      where: { id: BigInt(id) },
      data: { comment_text: commentText },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }

  async findByApplicationId(applicationId, { page = 1, limit = 50 } = {}) {
    const [data, total] = await Promise.all([
      this.prisma.applicationComment.findMany({
        where: { application_id: applicationId },
        include: {
          sender: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { created_at: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.applicationComment.count({
        where: { application_id: applicationId },
      }),
    ]);

    return { data, total, page, limit };
  }
}

module.exports = CommentRepository;
