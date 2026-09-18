// src/repositories/company.repository.js

class CompanyRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // ─── Companies ─────────────────────────

  async findAll({ page = 1, limit = 10, search }) {
    const where = {};
    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' } },
        { contact_person: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, role: true, is_active: true } } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.company.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id) {
    return this.prisma.company.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  async findByUserId(userId) {
    return this.prisma.company.findUnique({ where: { user_id: userId } });
  }

  // ─── Company Detail (Certificate Application) ───

  async createCompanyDetail(data) {
    return this.prisma.companyDetail.create({ data });
  }

  async findCompanyDetailByAppId(applicationId) {
    return this.prisma.companyDetail.findFirst({
      where: { application_id: applicationId },
      include: { brands: { include: { sub_brands: true } }, addresses: true, esg_details: true },
    });
  }

  // ─── Brands ────────────────────────────

  async createBrand(data) {
    return this.prisma.brand.create({ data });
  }

  async createSubBrand(data) {
    return this.prisma.subBrand.create({ data });
  }

  // ─── Addresses ─────────────────────────

  async createAddress(data) {
    return this.prisma.companyAddress.create({ data });
  }

  // ─── ESG Details ───────────────────────

  async createESGDetails(data) {
    return this.prisma.eSGDetails.create({ data });
  }
}

module.exports = CompanyRepository;
