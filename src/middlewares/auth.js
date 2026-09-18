// src/middlewares/auth.js
// JWT authentication and role-based authorization middleware

/**
 * Fastify preHandler hook — verifies the JWT access token.
 * Attaches decoded user payload to `request.user`.
 */
async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or expired access token' });
  }
}

/**
 * Factory — returns a preHandler that checks if the authenticated user
 * has one of the allowed roles.
 * @param  {...string} roles - e.g. 'ADMIN', 'COMPANY', 'CONSULTANT'
 */
function authorize(...roles) {
  return async (request, reply) => {
    // authenticate must run first so request.user exists
    if (!request.user) {
      return reply.code(401).send({ error: 'Unauthorized', message: 'Authentication required' });
    }
    if (!roles.includes(request.user.role)) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Insufficient permissions' });
    }
  };
}

module.exports = { authenticate, authorize };
