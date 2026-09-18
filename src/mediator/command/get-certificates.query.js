class GetCertificatesQuery {
  constructor({ page, limit, status, search, companyId, isCompany }) {
    this.page = page;
    this.limit = limit;
    this.status = status;
    this.search = search;
    this.companyId = companyId;
    this.isCompany = isCompany;
  }
}
module.exports = GetCertificatesQuery;
