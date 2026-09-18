// src/services/certificate.service.js
const fs = require('fs');
const path = require('path');

class CertificateService {
  constructor(certificateRepository) {
    this.certificateRepository = certificateRepository;
  }

  async getAll({ page, limit, status, search, companyId, isCompany = false }) {
    return this.certificateRepository.findAll({
      page,
      limit,
      status,
      search,
      companyId,
      paidOnly: isCompany, // Only paid certificates are returned to company
    });
  }

  async getById(id) {
    const cert = await this.certificateRepository.findById(id);
    if (!cert) {
      throw { statusCode: 404, message: 'Certificate not found' };
    }
    return cert;
  }

  async getByApplicationId(applicationId) {
    return this.certificateRepository.findByApplicationId(applicationId);
  }

  async pay(id) {
    const cert = await this.certificateRepository.findById(id);
    if (!cert) {
      throw { statusCode: 404, message: 'Certificate not found' };
    }
    return this.certificateRepository.markAsPaid(id);
  }

  async payByApplicationId(applicationId) {
    const cert = await this.certificateRepository.findByApplicationId(applicationId);
    if (!cert) {
      throw { statusCode: 404, message: 'No certificate found for this application' };
    }
    return this.certificateRepository.markAsPaid(cert.id);
  }

  async suspend(id) {
    const cert = await this.certificateRepository.findById(id);
    if (!cert) {
      throw { statusCode: 404, message: 'Certificate not found' };
    }
    return this.certificateRepository.updateStatus(id, 'suspended');
  }

  async generateCertificateHtml(id) {
    const cert = await this.certificateRepository.findById(id);
    if (!cert) {
      throw { statusCode: 404, message: 'Certificate not found' };
    }

    const templatePath = path.join(__dirname, '../views/pages/certificate.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Get company details
    const companyName = cert.company?.company_name || 'Acme Corporation';
    const companyNameAr = 'أكسي كوربوريشن'; // Fallback / mock
    const registrationNo = cert.company?.registration_number || 'N/A';
    const companyAddress = cert.application?.details?.[0]?.addresses?.[0]?.headoffice_address || 'Riyadh, Saudi Arabia';
    const products = cert.application?.details?.[0]?.brands?.[0]?.products || 'Products and Services';
    const productsAr = 'المنتجات والخدمات';
    const scope = cert.certificate_type || 'ESG Certification';
    const scopeAr = 'شهادة الاستدامة';

    const issueDate = cert.issued ? new Date(cert.issued).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
    const expiryDate = cert.expiry ? new Date(cert.expiry).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

    // Replace placeholders
    html = html.replace(/{{companyName}}/g, companyName);
    html = html.replace(/{{companyNameAr}}/g, companyNameAr);
    html = html.replace(/{{registrationNo}}/g, registrationNo);
    html = html.replace(/{{companyAddress}}/g, companyAddress);
    html = html.replace(/{{certificateNo}}/g, cert.id.substring(0, 8).toUpperCase());
    html = html.replace(/{{products}}/g, products);
    html = html.replace(/{{productsAr}}/g, productsAr);
    html = html.replace(/{{scope}}/g, scope);
    html = html.replace(/{{scopeAr}}/g, scopeAr);
    html = html.replace(/{{issueDate}}/g, issueDate);
    html = html.replace(/{{expiryDate}}/g, expiryDate);

    // Multi-site logic
    const appDetails = cert.application?.details?.[0];
    if (appDetails?.multiple_sites && Array.isArray(appDetails.site_details) && appDetails.site_details.length > 0) {
      const sites = appDetails.site_details;
      const appendixPath = path.join(__dirname, '../views/pages/certificate_appendix.html');
      let appendixHtml = fs.readFileSync(appendixPath, 'utf8');

      appendixHtml = appendixHtml.replace(/{{companyName}}/g, companyName);
      appendixHtml = appendixHtml.replace(/{{companyNameAr}}/g, companyNameAr);
      appendixHtml = appendixHtml.replace(/{{registrationNo}}/g, registrationNo);
      appendixHtml = appendixHtml.replace(/{{companyAddress}}/g, companyAddress);
      appendixHtml = appendixHtml.replace(/{{certificateNo}}/g, cert.id.substring(0, 8).toUpperCase());
      appendixHtml = appendixHtml.replace(/{{siteCount}}/g, sites.length);

      let sitesLoopHtml = '';
      sites.forEach(site => {
        sitesLoopHtml += `
          <div class="site-block">
              <div class="site-col-left">
                  <div class="site-title">| ${site.nameEn || 'SITE NAME'}</div>
                  <div>Address: ${site.addressEn || 'Address Not Provided'}</div>
                  <div>Activities Covered: ${site.activitiesEn || 'Activities Not Provided'}</div>
                  <div>Site-specific Scope: ${site.scopeEn || 'Scope Not Provided'}</div>
              </div>
              <div class="site-col-right">
                  <div class="site-title site-title-ar">${site.nameAr || 'اسم الموقع'} |</div>
                  <div>العنوان: ${site.addressAr || 'لم يتم توفير العنوان'}</div>
                  <div>الأنشطة المشمولة: ${site.activitiesAr || 'لم يتم توفير الأنشطة'}</div>
                  <div>النطاق الخاص بالموقع: ${site.scopeAr || 'لم يتم توفير النطاق'}</div>
              </div>
          </div>
        `;
      });

      appendixHtml = appendixHtml.replace(/{{sitesLoop}}/g, sitesLoopHtml);

      // We append the appendix right before the closing </body> tag of the main certificate
      html = html.replace('</body>', appendixHtml.match(/<div class="certificate-wrapper page-break">[\s\S]*<\/div>[\s]*<\/body>/)[0]);
    }

    return html;
  }
}

module.exports = CertificateService;
