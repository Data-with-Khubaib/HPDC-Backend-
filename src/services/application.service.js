// src/services/application.service.js
const pdfService = require('./pdf.service');
const { uploadBuffer } = require('../config/cloudinary');

class ApplicationService {
  constructor(applicationRepository) {
    this.applicationRepository = applicationRepository;
  }

  /**
   * Submit complete multi-step application
   * Triggers background PDF generation & Cloudinary uploads asynchronously.
   */
  async submitFull(data, user) {
    const companyId = user?.companyId || data.company_id;
    const companyName = user?.company?.company_name || data.company_name || user?.name || 'Company';

    const fullData = {
      ...data,
      company_id: companyId,
      company_name: companyName,
    };

    const { application, companyDetail } = await this.applicationRepository.createFullApplication(fullData);

    // Asynchronous background job for PDF generation & Cloudinary upload (non-blocking)
    this._generateAndUploadPdfsAsync(application, companyDetail, data.surveys_grouped || []).catch((err) => {
      console.error('[Async PDF Generation Error]:', err.message);
    });

    return {
      success: true,
      application_id: application.id,
      application_no: application.application_no,
      status: application.status,
    };
  }

  /**
   * Background runner for PDFs
   */
  async _generateAndUploadPdfsAsync(application, companyDetail, surveyData) {
    try {
      // 1. Generate & Upload Company Profile PDF
      const profilePdfBuffer = await pdfService.generateCompanyProfilePdf(application, companyDetail);
      const profileUpload = await uploadBuffer(profilePdfBuffer, {
        public_id: `company_profile_${application.id}`,
      });

      await this.applicationRepository.addDocument({
        application_id: application.id,
        document_type: 'company_profile',
        file_name: 'Company_Profile.pdf',
        file_url: profileUpload.secure_url,
        uploaded_at: new Date(),
      });
      console.log(`[PDF] Company Profile PDF uploaded for app: ${application.id}`);

      // 2. Generate & Upload ESG Questionnaire PDF
      const esgPdfBuffer = await pdfService.generateEsgQuestionnairePdf(application, surveyData);
      const esgUpload = await uploadBuffer(esgPdfBuffer, {
        public_id: `esg_questionnaire_${application.id}`,
      });

      await this.applicationRepository.addDocument({
        application_id: application.id,
        document_type: 'esg_questionnaire',
        file_name: 'ESG_Questionnaire.pdf',
        file_url: esgUpload.secure_url,
        uploaded_at: new Date(),
      });
      console.log(`[PDF] ESG Questionnaire PDF uploaded for app: ${application.id}`);
    } catch (err) {
      console.error('[PDF Generation/Upload Failed]:', err);
    }
  }

  async getById(id) {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw { statusCode: 404, message: 'Application not found' };
    }
    return this._serialize(application);
  }

  async getAll(filters) {
    const result = await this.applicationRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((app) => this._serialize(app)),
    };
  }

  /**
   * Admin Take Action (Conditional Approve, Approve, Reject)
   */
  async adminTakeAction(id, action, reason, adminUserId) {
    const app = await this.applicationRepository.findById(id);
    if (!app) {
      throw { statusCode: 404, message: 'Application not found' };
    }

    if (!reason && action !== 'approve') {
      throw { statusCode: 400, message: 'Reason is required for this action' };
    }

    if (action === 'conditional_approve' || action === 'CONDITIONALLY_APPROVED' || action === 'Conditional Approve') {
      const [condition, updatedApp] = await this.applicationRepository.conditionallyApprove(id, reason, adminUserId);
      return this._serialize(updatedApp);
    }

    if (action === 'approve' || action === 'APPROVED' || action === 'Approved') {
      const { app: updatedApp } = await this.applicationRepository.approveApplication(id, reason || 'Application approved by Admin', adminUserId);
      return this._serialize(updatedApp);
    }

    if (action === 'reject' || action === 'REJECTED' || action === 'Rejected') {
      const updatedApp = await this.applicationRepository.rejectApplication(id, reason, adminUserId);
      return this._serialize(updatedApp);
    }

    throw { statusCode: 400, message: `Unknown action: ${action}` };
  }

  /**
   * Company Take Action (When status is conditional_approve)
   */
  async companyTakeAction(id, companyUserId, commentText, documentUrl, documentName) {
    const app = await this.applicationRepository.findById(id);
    if (!app) {
      throw { statusCode: 404, message: 'Application not found' };
    }

    if (app.status !== 'Conditional Approve') {
      throw { statusCode: 400, message: 'Take Action is only available for conditionally approved applications' };
    }

    const updatedApp = await this.applicationRepository.companyTakeAction(
      id,
      companyUserId,
      commentText,
      documentUrl,
      documentName
    );

    return this._serialize(updatedApp);
  }

  async getDocuments(applicationId) {
    return this.applicationRepository.getDocuments(applicationId);
  }

  _serialize(app) {
    if (!app) return app;
    return {
      ...app,
      receiver_id: app.receiver_id ? app.receiver_id.toString() : null,
      submitted_at: app.submitted_at ? app.submitted_at.toString() : null,
      company: app.company
        ? {
            ...app.company,
            phone_number: app.company.phone_number ? app.company.phone_number.toString() : null,
            registration_number: app.company.registration_number ? app.company.registration_number.toString() : null,
          }
        : undefined,
      details: app.details?.map((d) => ({
        ...d,
        registration_no: d.registration_no ? d.registration_no.toString() : null,
        tax_registration_no: d.tax_registration_no ? d.tax_registration_no.toString() : null,
        contact_no: d.contact_no ? d.contact_no.toString() : null,
        brands: d.brands?.map((b) => ({
          ...b,
          id: b.id.toString(),
          company_id: b.company_id.toString(),
          sub_brands: b.sub_brands?.map((sb) => ({
            ...sb,
            id: sb.id.toString(),
            brand_id: sb.brand_id.toString(),
          })),
        })),
        addresses: d.addresses?.map((a) => ({
          ...a,
          id: a.id.toString(),
          company_id: a.company_id.toString(),
        })),
        esg_details: d.esg_details?.map((e) => ({
          ...e,
          id: e.id.toString(),
          company_id: e.company_id.toString(),
        })),
      })),
      comments: app.comments?.map((c) => ({
        ...c,
        id: c.id.toString(),
        sender_name: c.sender?.name || 'User',
        sender_role: c.sender?.role || 'USER',
        is_editable: (Date.now() - new Date(c.created_at).getTime()) <= 15 * 60 * 1000,
      })),
    };
  }
}

module.exports = ApplicationService;

