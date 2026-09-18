class GetCommentsQuery {
  constructor({ id, page, limit }) {
    this.id = id;
    this.page = page;
    this.limit = limit;
  }
}
module.exports = GetCommentsQuery;
