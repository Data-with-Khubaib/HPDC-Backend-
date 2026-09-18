class GetCommentsQueryHandler {
  constructor(commentService) {
    this.commentService = commentService;
  }
  async handle(query) {
    return await this.commentService.getComments(query.id, { page: query.page, limit: query.limit });
  }
}
module.exports = GetCommentsQueryHandler;
