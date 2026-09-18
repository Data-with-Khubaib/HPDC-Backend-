// src/repositories/application.repository.js

class ApplicationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.application.create({ data });
  }

  /**
   * Full atomic submission of multi-step application wizard data
   */
  async createFullApplication(data) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Generate custom Application Number (APP_2026_XX)
      const count = await tx.application.count();
      const numStr = String(count + 1).padStart(2, '0');
      const appNumber = 'APP_2026_' + numStr;

      // 2. Create Application
      const application = await tx.application.create({
        data: {
          application_no: appNumber,
          company_id: data.company_id,
          company_name: data.company_name,
          receiver_id: BigInt(Date.now()),
          status: 'Submitted',
          certificate_type: data.certificate_type || '2 Years',
          paid: false,
          submitted_at: BigInt(Date.now()),
        },
      });

      // Insert into timeline
      await tx.activityTimeline.create({
        data: {
          application_id: application.id,
          email: 'system',
          action_text: 'Application Submitted',
          created_at: new Date(),
        }
      });


      const regNo = BigInt(data.registration_no || Date.now().toString().slice(-8));

      // 2. Create CompanyDetail
      const companyDetail = await tx.companyDetail.create({
        data: {
          registration_no: regNo,
          application_id: application.id,
          company_name: data.company_name,
          tax_registration_no: BigInt(data.tax_registration_no || '1000000000'),
          buisness_type: data.buisness_type || 'Corporate',
          sector: data.sector || 'Manufacturing',
          contact_no: BigInt(data.contact_no || '966500000000'),
          scope: data.scope || 'ESG & Quality Certification',
          multiple_sites: Boolean(data.multiple_sites),
          site_details: data.site_details || [],
          employees: data.employees || { total: 100, permanent: 80, contract: 20 },
          certifications: data.certifications || {},
          additional_notes: data.additional_notes || '',
          updated_at: new Date(),
        },
      });

      // 3. Create CompanyAddress
      if (data.address) {
        await tx.companyAddress.create({
          data: {
            company_id: regNo,
            headoffice_address: data.address.headoffice_address || data.address.address_line || 'Main Headquarters',
            national_address: data.address.national_address || data.address.city || '',
            detailed_address: data.address.detailed_address || data.address.address_line || 'Corporate Office',
          },
        });
      }

      // 4. Create Brand & SubBrands
      if (data.brand) {
        const brand = await tx.brand.create({
          data: {
            company_id: regNo,
            activities: data.brand.activities || 'Industrial Manufacturing',
            products: data.brand.products || 'Consumer Products',
            critical_process: Boolean(data.brand.critical_process),
            outsourced_processed: Boolean(data.brand.outsourced_processes || data.brand.outsourced_processed),
          },
        });

        if (data.sub_brands && Array.isArray(data.sub_brands)) {
          for (const sb of data.sub_brands) {
            await tx.subBrand.create({
              data: {
                brand_id: brand.id,
                brand_name: sb.brand_name || 'Brand Item',
                brand_skus: parseInt(sb.brand_skus || '1'),
              },
            });
          }
        }
      }

      // 5. Create ESG Details
      await tx.eSGDetails.create({
        data: {
          company_id: regNo,
          program_in_place: Boolean(data.esg_details?.program_in_place ?? true),
          has_esh_policy: Boolean(data.esg_details?.has_esh_policy ?? true),
          has_sustainability_report: Boolean(data.esg_details?.has_sustainability_report ?? true),
          has_ghg_monitoring: Boolean(data.esg_details?.has_ghg_monitoring ?? true),
          has_energy_management: Boolean(data.esg_details?.has_energy_management ?? true),
          has_social_responsibility: Boolean(data.esg_details?.has_social_responsibility ?? true),
          has_grc_framework: Boolean(data.esg_details?.has_grc_framework ?? true),
        },
      });

      // 6. Save Survey Answers
      if (data.survey_answers && Array.isArray(data.survey_answers)) {
        for (const ans of data.survey_answers) {
          await tx.answer.create({
            data: {
              application_id: application.id,
              question_id: BigInt(ans.question_id || 1),
              survey_answers: ans.survey_answers || ans.answer || 'Yes',
              partial_text: ans.partial_text || ans.partial_answer || '',
            },
          });
        }
      }

      // 7. Save Legal & Supporting Documents
      if (data.documents && Array.isArray(data.documents)) {
        for (const doc of data.documents) {
          await tx.applicationDocument.create({
            data: {
              application_id: application.id,
              document_type: doc.document_type || 'legal_doc',
              file_name: doc.file_name || 'document.pdf',
              file_url: doc.file_url,
              uploaded_at: new Date(),
            },
          });
        }
      }

      return { application, companyDetail };
    });
  }

  async findById(id) {
    return this.prisma.application.findUnique({
      where: { id },
      include: {
        company: true,
        certificates: true,
        documents: { orderBy: { uploaded_at: 'desc' } },
        conditions: { orderBy: { created_at: 'desc' } },
        comments: {
          include: { sender: true },
          orderBy: { created_at: 'asc' },
        },
        logs: { orderBy: { created_at: 'desc' } },
        timelines: { orderBy: { created_at: 'desc' } },
        details: {
          include: {
            brands: { include: { sub_brands: true } },
            addresses: true,
            esg_details: true,
          },
        },
      },
    });
  }

  async findAll({ page = 1, limit = 10, status, companyId, search }) {
    const where = {};
    if (status) where.status = { contains: status, mode: 'insensitive' };
    if (companyId) where.company_id = companyId;
    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' } },
        { application_no: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          company: true,
          documents: true,
          certificates: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { submitted_at: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async updateStatus(id, status) {
    return this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }

  async conditionallyApprove(applicationId, reason, adminUserId) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Condition
      const condition = await tx.applicationCondition.create({
        data: { application_id: applicationId, reason },
      });

      // 2. Status update
      const app = await tx.application.update({
        where: { id: applicationId },
        data: { status: 'Conditional Approve' },
      });

      // 3. Comment by Admin so it shows in comment panel
      if (adminUserId) {
        await tx.applicationComment.create({
          data: {
            application_id: applicationId,
            sender_id: adminUserId,
            comment_text: `[Conditional Approval]: ${reason}`,
          },
        });
      }

      return [condition, app];
    });
  }

  async approveApplication(applicationId, reason, adminUserId) {
    return this.prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id: applicationId },
        data: { status: 'Approved' },
      });

      // Create Certificate with paid = false
      const cert = await tx.certificate.create({
        data: {
          company_id: app.company_id,
          application_id: app.id,
          certificate_type: app.certificate_type || '2 Years',
          status: 'active',
          issued: new Date(),
          expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2),
          sites: 1,
          paid: false,
        },
      });

      if (adminUserId && reason) {
        await tx.applicationComment.create({
          data: {
            application_id: applicationId,
            sender_id: adminUserId,
            comment_text: `[Approved]: ${reason}`,
          },
        });
      }

      return { app, cert };
    });
  }

  async rejectApplication(applicationId, reason, adminUserId) {
    return this.prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id: applicationId },
        data: { status: 'Rejected' },
      });

      if (adminUserId && reason) {
        await tx.applicationComment.create({
          data: {
            application_id: applicationId,
            sender_id: adminUserId,
            comment_text: `[Rejected]: ${reason}`,
          },
        });
      }

      return app;
    });
  }

  async companyTakeAction(applicationId, companyUserId, commentText, documentUrl, documentName) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Post comment
      if (commentText) {
        await tx.applicationComment.create({
          data: {
            application_id: applicationId,
            sender_id: companyUserId,
            comment_text: commentText,
          },
        });
      }

      // 2. Add document if uploaded
      if (documentUrl) {
        await tx.applicationDocument.create({
          data: {
            application_id: applicationId,
            document_type: 'supporting_doc',
            file_name: documentName || 'clarification_doc.pdf',
            file_url: documentUrl,
            uploaded_at: new Date(),
          },
        });
      }

      // 3. Update status to assessment_schedule
      const app = await tx.application.update({
        where: { id: applicationId },
        data: { status: 'Assessment Schedule' },
      });

      return app;
    });
  }

  async getDocuments(applicationId) {
    return this.prisma.applicationDocument.findMany({
      where: { application_id: applicationId },
      orderBy: { uploaded_at: 'desc' },
    });
  }

  async addDocument(data) {
    return this.prisma.applicationDocument.create({ data });
  }
}

module.exports = ApplicationRepository;





