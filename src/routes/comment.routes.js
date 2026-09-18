// src/routes/comment.routes.js
const { authenticate } = require('../middlewares/auth');

async function commentRoutes(fastify, { commentController }) {
  // REST: Get comments
  fastify.get('/applications/:id/comments', {
    preHandler: [authenticate],
  }, (req, reply) => commentController.getComments(req, reply));

  // REST: Post comment
  fastify.post('/applications/:id/comments', {
    preHandler: [authenticate],
  }, (req, reply) => commentController.postComment(req, reply));

  // REST: Edit comment
  fastify.put('/applications/:id/comments/:commentId', {
    preHandler: [authenticate],
  }, (req, reply) => commentController.editComment(req, reply));

  // WebSocket: Real-time comments
  fastify.get('/ws/applications/:applicationId/comments', {
    websocket: true,
  }, (connection, request) => {
    const token = request.query.token;
    if (!token) {
      connection.send(JSON.stringify({ type: 'error', message: 'Authentication token required' }));
      connection.close();
      return;
    }

    try {
      const decoded = fastify.jwt.verify(token);
      request.user = decoded;
    } catch (err) {
      connection.send(JSON.stringify({ type: 'error', message: 'Invalid or expired token' }));
      connection.close();
      return;
    }

    commentController.handleWebSocket(connection, request);
  });
}

module.exports = commentRoutes;
