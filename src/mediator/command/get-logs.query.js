class GetLogsQuery {
  constructor({ page, limit, search }) {
    this.page = page;
    this.limit = limit;
    this.search = search;
  }
}
module.exports = GetLogsQuery;
