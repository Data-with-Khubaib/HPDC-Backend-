// src/services/comment.service.js

class CommentService {
  constructor(commentRepository, wsPool) {
    this.commentRepository = commentRepository;
    this.wsPool = wsPool;
  }

  async getComments(applicationId, pagination) {
    const result = await this.commentRepository.findByApplicationId(applicationId, pagination);
    return {
      ...result,
      data: result.data.map((c) => ({
        id: c.id.toString(),
        application_id: c.application_id,
        sender_id: c.sender_id,
        sender_name: c.sender?.name || 'User',
        sender_role: c.sender?.role || 'USER',
        comment_text: c.comment_text,
        created_at: c.created_at,
        is_editable: (Date.now() - new Date(c.created_at).getTime()) <= 15 * 60 * 1000,
      })),
    };
  }

  async createAndBroadcast({ applicationId, senderId, commentText, excludeSocket }) {
    const comment = await this.commentRepository.create({
      applicationId,
      senderId,
      commentText,
    });

    const serialized = {
      id: comment.id.toString(),
      application_id: comment.application_id,
      sender_id: comment.sender_id,
      sender_name: comment.sender?.name || 'User',
      sender_role: comment.sender?.role || 'USER',
      comment_text: comment.comment_text,
      created_at: comment.created_at,
      is_editable: true,
    };

    this.wsPool.broadcast(
      applicationId,
      {
        type: 'new_comment',
        data: serialized,
      },
      excludeSocket
    );

    return serialized;
  }

  async editAndBroadcast({ commentId, userId, userRole, newText, excludeSocket }) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw { statusCode: 404, message: 'Comment not found' };
    }

    if (comment.sender_id !== userId) {
      throw { statusCode: 403, message: 'You can only edit your own comments' };
    }

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      const elapsed = Date.now() - new Date(comment.created_at).getTime();
      if (elapsed > 15 * 60 * 1000) {
        throw { statusCode: 400, message: 'Comments can only be edited within 15 minutes of posting' };
      }
    }

    const updated = await this.commentRepository.update(commentId, newText);

    const serialized = {
      id: updated.id.toString(),
      application_id: updated.application_id,
      sender_id: updated.sender_id,
      sender_name: updated.sender?.name || 'User',
      sender_role: updated.sender?.role || 'USER',
      comment_text: updated.comment_text,
      created_at: updated.created_at,
      is_editable: (Date.now() - new Date(updated.created_at).getTime()) <= 15 * 60 * 1000,
    };

    this.wsPool.broadcast(
      updated.application_id,
      {
        type: 'comment_edited',
        data: serialized,
      },
      excludeSocket
    );

    return serialized;
  }
}

module.exports = CommentService;
