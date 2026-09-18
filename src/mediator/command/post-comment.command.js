class PostCommentCommand {
  constructor({ id, comment_text, senderId }) {
    this.id = id;
    this.comment_text = comment_text;
    this.senderId = senderId;
  }
}
module.exports = PostCommentCommand;
