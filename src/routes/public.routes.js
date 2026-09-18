// src/routes/public.routes.js
// Public endpoints — NO authentication required
const prisma = require('../config/prisma');

async function publicRoutes(fastify) {

  /**
   * GET /public/registry
   * Returns paginated list of certificates with company info.
   * Query params: page, limit, search, sector, country, status
   */
  fastify.get('/public/registry', async (request, reply) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sector,
        country,
        status,
      } = request.query;

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;

      // Build certificate filter
      const certWhere = {};

      if (status) {
        certWhere.status = status;
      }

      // Build company filter
      const companyWhere = {};
      if (sector) {
        companyWhere.sector = { contains: sector, mode: 'insensitive' };
      }
      if (country) {
        companyWhere.country = { contains: country, mode: 'insensitive' };
      }

      // Search across multiple fields
      if (search) {
        certWhere.OR = [
          { id: { contains: search, mode: 'insensitive' } },
          { certificate_type: { contains: search, mode: 'insensitive' } },
          {
            company: {
              OR: [
                { company_name: { contains: search, mode: 'insensitive' } },
                { contact_person: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        ];
      }

      // Merge company filters into certificate where
      if (Object.keys(companyWhere).length > 0) {
        certWhere.company = { ...companyWhere };
      }

      const [data, total] = await Promise.all([
        prisma.certificate.findMany({
          where: certWhere,
          include: {
            company: {
              include: {
                user: {
                  select: { name: true, email: true, phone_number: true },
                },
              },
            },
            application: {
              select: { id: true, certificate_type: true, status: true },
            },
          },
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          orderBy: { issued: 'desc' },
        }),
        prisma.certificate.count({ where: certWhere }),
      ]);

      // Serialize BigInt fields
      const serialized = data.map((cert) => ({
        id: cert.id,
        certificate_type: cert.certificate_type,
        status: cert.status,
        issued: cert.issued,
        expiry: cert.expiry,
        sites: cert.sites,
        paid: cert.paid,
        company: cert.company
          ? {
              id: cert.company.id,
              company_name: cert.company.company_name,
              sector: cert.company.sector,
              country: cert.company.country,
              phone_number: cert.company.phone_number
                ? cert.company.phone_number.toString()
                : null,
              registration_number: cert.company.registration_number
                ? cert.company.registration_number.toString()
                : null,
              contact_person: cert.company.contact_person,
              user_name: cert.company.user?.name || null,
              user_email: cert.company.user?.email || null,
            }
          : null,
      }));

      return reply.code(200).send({
        success: true,
        data: serialized,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    } catch (err) {
      fastify.log.error(err);
      return reply
        .code(500)
        .send({ success: false, error: 'Failed to fetch registry data' });
    }
  });

  /**
   * GET /public/verify?query=...
   * Searches certificates by keyword matching against:
   *  - certificate ID
   *  - company name
   *  - registration number
   *  - certificate_type
   */
  fastify.get('/public/verify', async (request, reply) => {
    try {
      const { query } = request.query;

      if (!query || query.trim() === '') {
        return reply.code(400).send({
          success: false,
          error: 'Search query is required',
        });
      }

      const searchTerm = query.trim();

      const certificates = await prisma.certificate.findMany({
        where: {
          OR: [
            { id: { contains: searchTerm, mode: 'insensitive' } },
            { certificate_type: { contains: searchTerm, mode: 'insensitive' } },
            {
              company: {
                OR: [
                  { company_name: { contains: searchTerm, mode: 'insensitive' } },
                  { contact_person: { contains: searchTerm, mode: 'insensitive' } },
                ],
              },
            },
          ],
        },
        include: {
          company: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          application: {
            select: {
              id: true,
              certificate_type: true,
              status: true,
              details: {
                select: {
                  company_name: true,
                  scope: true,
                  registration_no: true,
                  addresses: {
                    select: { headoffice_address: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
        take: 10,
        orderBy: { issued: 'desc' },
      });

      // Also try to match by registration_number (BigInt)
      let regNumberResults = [];
      const asNumber = parseInt(searchTerm);
      if (!isNaN(asNumber) && asNumber > 0) {
        regNumberResults = await prisma.certificate.findMany({
          where: {
            company: {
              registration_number: BigInt(asNumber),
            },
          },
          include: {
            company: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
            application: {
              select: {
                id: true,
                certificate_type: true,
                status: true,
                details: {
                  select: {
                    company_name: true,
                    scope: true,
                    registration_no: true,
                    addresses: {
                      select: { headoffice_address: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
          take: 5,
        });
      }

      // Merge and deduplicate
      const allCerts = [...certificates, ...regNumberResults];
      const seen = new Set();
      const unique = allCerts.filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });

      // Serialize
      const serialized = unique.map((cert) => {
        const detail = cert.application?.details?.[0] || null;
        return {
          id: cert.id,
          certificate_type: cert.certificate_type,
          status: cert.status,
          issued: cert.issued,
          expiry: cert.expiry,
          company_name:
            detail?.company_name ||
            cert.company?.company_name ||
            'Unknown',
          registration_number: detail?.registration_no
            ? detail.registration_no.toString()
            : cert.company?.registration_number
            ? cert.company.registration_number.toString()
            : null,
          scope: detail?.scope || cert.certificate_type,
          address:
            detail?.addresses?.[0]?.headoffice_address || null,
          company: cert.company
            ? {
                id: cert.company.id,
                company_name: cert.company.company_name,
                sector: cert.company.sector,
                country: cert.company.country,
                phone_number: cert.company.phone_number
                  ? cert.company.phone_number.toString()
                  : null,
                registration_number: cert.company.registration_number
                  ? cert.company.registration_number.toString()
                  : null,
              }
            : null,
        };
      });

      return reply.code(200).send({
        success: true,
        data: serialized,
        total: serialized.length,
      });
    } catch (err) {
      fastify.log.error(err);
      return reply
        .code(500)
        .send({ success: false, error: 'Verification search failed' });
    }
  });
}

module.exports = publicRoutes;
