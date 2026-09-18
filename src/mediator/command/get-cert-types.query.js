class GetCertTypesQuery {
  constructor({ page, limit, status, search }) {
    this.page = page;
    this.limit = limit;
    this.status = status;
    this.search = search;
  }
}
module.exports = GetCertTypesQuery;
