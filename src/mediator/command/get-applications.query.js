class GetApplicationsQuery {
  constructor({ page, limit, status, search, companyId }) {
    this.page = page;
    this.limit = limit;
    this.status = status;
    this.search = search;
    this.companyId = companyId;
  }
}
module.exports = GetApplicationsQuery;
