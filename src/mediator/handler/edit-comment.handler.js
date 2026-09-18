class EditCommentCommandHandler {
  constructor(commentService) {
    this.commentService = commentService;
  }
  async handle(command) {
    return await this.commentService.editAndBroadcast({
      commentId: command.commentId,
      userId: command.userId,
      userRole: command.userRole,
      newText: command.comment_text,
    });
  }
}
module.exports = EditCommentCommandHandler;
