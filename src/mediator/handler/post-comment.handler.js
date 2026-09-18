class PostCommentCommandHandler {
  constructor(commentService) {
    this.commentService = commentService;
  }
  async handle(command) {
    return await this.commentService.createAndBroadcast({
      applicationId: command.id,
      senderId: command.senderId,
      commentText: command.comment_text,
    });
  }
}
module.exports = PostCommentCommandHandler;
