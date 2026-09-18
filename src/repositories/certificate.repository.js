// src/repositories/certificate.repository.js

class CertificateRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ page = 1, limit = 10, companyId, status, search, paidOnly = false }) {
    const where = {};
    if (companyId) where.company_id = companyId;
    if (paidOnly) where.paid = true;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { certificate_type: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where,
        include: {
          company: true,
          application: {
            include: { details: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { issued: 'desc' },
      }),
      this.prisma.certificate.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id) {
    return this.prisma.certificate.findUnique({
      where: { id },
      include: {
        company: true,
        application: {
          include: { details: true },
        },
      },
    });
  }

  async findByApplicationId(applicationId) {
    return this.prisma.certificate.findFirst({
      where: { application_id: applicationId },
      include: { company: true, application: true },
    });
  }

  async markAsPaid(id) {
    return this.prisma.certificate.update({
      where: { id },
      data: { paid: true },
      include: { company: true, application: true },
    });
  }

  async updateStatus(id, status) {
    return this.prisma.certificate.update({
      where: { id },
      data: { status },
      include: { company: true, application: true },
    });
  }
}

module.exports = CertificateRepository;
