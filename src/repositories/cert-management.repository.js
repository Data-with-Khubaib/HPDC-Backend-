// src/repositories/cert-management.repository.js

class CertManagementRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ page = 1, limit = 10, status, search }) {
    const where = {};
    if (typeof status === 'boolean') where.status = status;
    if (search) {
      where.certificate_name = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.certificateManagement.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { certificate_name: 'asc' },
      }),
      this.prisma.certificateManagement.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id) {
    return this.prisma.certificateManagement.findUnique({ where: { id } });
  }

  async create(data) {
    return this.prisma.certificateManagement.create({ data });
  }

  async update(id, data) {
    return this.prisma.certificateManagement.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return this.prisma.certificateManagement.delete({ where: { id } });
  }
}

module.exports = CertManagementRepository;
