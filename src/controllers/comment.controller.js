// src/controllers/comment.controller.js

const GetCommentsQuery = require('../mediator/command/get-comments.query');
const PostCommentCommand = require('../mediator/command/post-comment.command');
const EditCommentCommand = require('../mediator/command/edit-comment.command');

class CommentController {
  constructor(mediator, wsPool) {
    this.mediator = mediator;
    this.wsPool = wsPool;
  }

  // REST: GET /applications/:id/comments
  async getComments(request, reply) {
    try {
      const { id } = request.params;
      const { page, limit } = request.query;
      const query = new GetCommentsQuery({ id, page, limit });
      const result = await this.mediator.send(query);
      return reply.code(200).send({ success: true, data: result });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  // REST: POST /applications/:id/comments
  async postComment(request, reply) {
    try {
      const { id } = request.params;
      const { comment_text } = request.body;
      const command = new PostCommentCommand({
        id,
        comment_text,
        senderId: request.user.id
      });
      const comment = await this.mediator.send(command);
      return reply.code(201).send({ success: true, data: comment });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  // REST: PUT /applications/:id/comments/:commentId
  async editComment(request, reply) {
    try {
      const { commentId } = request.params;
      const { comment_text } = request.body;
      const command = new EditCommentCommand({
        commentId,
        userId: request.user.id,
        userRole: request.user.role,
        comment_text,
      });
      const updated = await this.mediator.send(command);
      return reply.code(200).send({ success: true, data: updated });
    } catch (err) {
      return reply.code(err.statusCode || 500).send({ success: false, error: err.message, details: err.details || undefined });
    }
  }

  /**
   * WebSocket handler for /ws/applications/:applicationId/comments
   */
  handleWebSocket(connection, request) {
    const { applicationId } = request.params;
    const socket = connection;
    const user = request.user;

    this.wsPool.join(applicationId, socket);

    socket.send(JSON.stringify({
      type: 'connected',
      message: `Connected to comments for application ${applicationId}`,
      room_size: this.wsPool.getRoomSize(applicationId),
    }));

    socket.on('message', async (rawMessage) => {
      try {
        const data = JSON.parse(rawMessage.toString());

        if (data.type === 'send_comment') {
          const comment = await this.commentService.createAndBroadcast({
            applicationId,
            senderId: user?.id || data.sender_id,
            commentText: data.comment_text,
            excludeSocket: socket,
          });
          socket.send(JSON.stringify({ type: 'comment_sent', success: true, data: comment }));
        } else if (data.type === 'edit_comment') {
          const updated = await this.commentService.editAndBroadcast({
            commentId: data.comment_id,
            userId: user?.id || data.sender_id,
            userRole: user?.role,
            newText: data.comment_text,
            excludeSocket: socket,
          });
          socket.send(JSON.stringify({ type: 'comment_edited', success: true, data: updated }));
        }
      } catch (err) {
        socket.send(JSON.stringify({ type: 'error', message: err.message || 'Failed to process message' }));
      }
    });

    socket.on('close', () => {
      this.wsPool.leave(applicationId, socket);
    });

    socket.on('error', () => {
      this.wsPool.leave(applicationId, socket);
    });
  }
}

module.exports = CommentController;
