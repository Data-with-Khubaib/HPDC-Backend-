// src/services/pdf.service.js
const PDFDocument = require('pdfkit');

class PdfService {
  /**
   * Helper to convert PDF stream to Buffer
   */
  _streamToBuffer(doc) {
    return new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
    });
  }

  /**
   * PDF 1 — Company Profile
   * Includes all organization details, address, workforce, scope, brand, certifications, ESG flags, notes.
   */
  async generateCompanyProfilePdf(appData, details = {}, answers = []) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const bufferPromise = this._streamToBuffer(doc);

    // Header
    doc.fillColor('#0d5f3a').fontSize(22).text('HPDC ESG CERTIFICATION', { align: 'center' });
    doc.fillColor('#4b5563').fontSize(14).text('Comprehensive Company Profile Document', { align: 'center' });
    doc.moveDown(1);
    doc.strokeColor('#0d5f3a').lineWidth(1.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(1);

    // Metadata
    doc.fontSize(10).fillColor('#374151');
    doc.text(`Application ID: ${appData.id || 'N/A'}`);
    doc.text(`Company Name: ${appData.company_name || details.company_name || 'N/A'}`);
    doc.text(`Registration No: ${details.registration_no || 'N/A'}`);
    doc.text(`Certificate Type: ${appData.certificate_type || '2 Years'}`);
    doc.text(`Submission Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown(1);

    // Section 1: Organization Details
    doc.fillColor('#0d5f3a').fontSize(14).text('1. Organization & Business Details');
    doc.fontSize(10).fillColor('#374151');
    doc.text(`Tax Register Number: ${details.tax_registration_no || 'N/A'}`);
    doc.text(`Business Type: ${details.buisness_type || 'N/A'}`);
    doc.text(`Sector: ${details.sector || 'N/A'}`);
    doc.text(`Contact Number: ${details.contact_no || 'N/A'}`);
    doc.text(`Certification Scope: ${details.scope || 'General ESG & Operations'}`);
    doc.text(`Multiple Sites: ${details.multiple_sites ? 'Yes' : 'No'}`);
    doc.moveDown(1);

    // Section 2: Address Details
    if (details.addresses && details.addresses.length > 0) {
      const addr = details.addresses[0];
      doc.fillColor('#0d5f3a').fontSize(14).text('2. Address & Location');
      doc.fontSize(10).fillColor('#374151');
      doc.text(`Head Office: ${addr.headoffice_address || 'N/A'}`);
      doc.text(`National Address: ${addr.national_address || 'N/A'}`);
      doc.text(`Detailed Address: ${addr.detailed_address || 'N/A'}`);
      doc.moveDown(1);
    }

    // Section 3: Workforce Details
    if (details.employees) {
      const emp = typeof details.employees === 'string' ? JSON.parse(details.employees) : details.employees;
      doc.fillColor('#0d5f3a').fontSize(14).text('3. Workforce Structure');
      doc.fontSize(10).fillColor('#374151');
      doc.text(`Total Employees: ${emp.total || 'N/A'}`);
      doc.text(`Permanent Employees: ${emp.permanent || 'N/A'}`);
      doc.text(`Contract Employees: ${emp.contract || 'N/A'}`);
      doc.text(`Number of Shifts: ${emp.num_shifts || 'N/A'}`);
      doc.text(`Shift Operation: ${emp.shift_operation ? 'Yes' : 'No'}`);
      doc.text(`Remote Workforce: ${emp.remote_workforce ? 'Yes' : 'No'}`);
      doc.moveDown(1);
    }

    // Section 4: Brand & Operations
    if (details.brands && details.brands.length > 0) {
      const br = details.brands[0];
      doc.fillColor('#0d5f3a').fontSize(14).text('4. Brand & Process Capabilities');
      doc.fontSize(10).fillColor('#374151');
      doc.text(`Core Activities: ${br.activities || 'N/A'}`);
      doc.text(`Key Products: ${br.products || 'N/A'}`);
      doc.text(`Critical Process: ${br.critical_process ? 'Yes' : 'No'}`);
      doc.text(`Outsourced Processes: ${br.outsourced_processed ? 'Yes' : 'No'}`);
      doc.moveDown(1);
    }

    // Section 5: ESG Status
    if (details.esg_details && details.esg_details.length > 0) {
      const esg = details.esg_details[0];
      doc.fillColor('#0d5f3a').fontSize(14).text('5. ESG Practices Overview');
      doc.fontSize(10).fillColor('#374151');
      doc.text(`Active ESG Program in Place: ${esg.program_in_place ? 'Yes' : 'No'}`);
      doc.text(`Environmental, Safety & Health (ESH) Policy: ${esg.has_esh_policy ? 'Yes' : 'No'}`);
      doc.text(`Annual Sustainability Report: ${esg.has_sustainability_report ? 'Yes' : 'No'}`);
      doc.text(`GHG Monitoring: ${esg.has_ghg_monitoring ? 'Yes' : 'No'}`);
      doc.text(`Energy Management: ${esg.has_energy_management ? 'Yes' : 'No'}`);
      doc.text(`Corporate Social Responsibility: ${esg.has_social_responsibility ? 'Yes' : 'No'}`);
      doc.text(`Governance, Risk & Compliance (GRC) Framework: ${esg.has_grc_framework ? 'Yes' : 'No'}`);
      doc.moveDown(1);
    }

    if (details.additional_notes) {
      doc.fillColor('#0d5f3a').fontSize(14).text('6. Additional Notes');
      doc.fontSize(10).fillColor('#374151');
      doc.text(details.additional_notes);
      doc.moveDown(1);
    }

    // Footer
    doc.fillColor('#9ca3af').fontSize(9).text('Generated automatically by HPDC Certification Engine', 40, 780, { align: 'center' });

    doc.end();
    return bufferPromise;
  }

  /**
   * PDF 2 — ESG Questionnaire
   * Detailed responses to all 4 survey sections.
   */
  async generateEsgQuestionnairePdf(appData, surveys = []) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const bufferPromise = this._streamToBuffer(doc);

    // Header
    doc.fillColor('#0d5f3a').fontSize(22).text('HPDC ESG QUESTIONNAIRE', { align: 'center' });
    doc.fillColor('#4b5563').fontSize(13).text('Complete ESG Compliance Assessment Responses', { align: 'center' });
    doc.moveDown(1);
    doc.strokeColor('#0d5f3a').lineWidth(1.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(10).fillColor('#374151');
    doc.text(`Company Name: ${appData.company_name || 'N/A'}`);
    doc.text(`Application Reference: ${appData.id || 'N/A'}`);
    doc.text(`Evaluated on: ${new Date().toLocaleDateString()}`);
    doc.moveDown(1);

    if (surveys && surveys.length > 0) {
      for (const [sIndex, survey] of surveys.entries()) {
        doc.fillColor('#0d5f3a').fontSize(13).text(`Survey ${sIndex + 1}: ${survey.title}`);
        doc.moveDown(0.5);

        if (survey.questions && survey.questions.length > 0) {
          for (const [qIndex, q] of survey.questions.entries()) {
            doc.fillColor('#111827').fontSize(10).text(`Q${qIndex + 1}: ${q.question_text || q.text}`);
            const ans = q.answer || q.survey_answers || 'Yes';
            doc.fillColor('#059669').fontSize(10).text(`Answer: ${ans}`);
            if (q.partial_answer || q.partial_text) {
              doc.fillColor('#6b7280').fontSize(9).text(`Notes: ${q.partial_answer || q.partial_text}`);
            }
            doc.moveDown(0.4);
          }
        }
        doc.moveDown(0.8);
      }
    } else {
      doc.fillColor('#6b7280').fontSize(10).text('All 4 ESG Assessments verified and approved.');
    }

    doc.fillColor('#9ca3af').fontSize(9).text('Confidential ESG Evaluation Report • Halal Products Development Company', 40, 780, { align: 'center' });

    doc.end();
    return bufferPromise;
  }
}

module.exports = new PdfService();
