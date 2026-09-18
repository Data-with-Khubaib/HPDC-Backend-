class EditCommentCommand {
  constructor({ commentId, comment_text, userId, userRole }) {
    this.commentId = commentId;
    this.comment_text = comment_text;
    this.userId = userId;
    this.userRole = userRole;
  }
}
module.exports = EditCommentCommand;
