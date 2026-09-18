const { z } = require('zod');

const getCommentsSchema = z.object({
  id: z.string({ required_error: 'Application ID is required' }),
  page: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
  limit: z.number().int().positive().optional().or(z.string().regex(/^\d+$/).transform(Number)),
});

const postCommentSchema = z.object({
  id: z.string({ required_error: 'Application ID is required' }),
  comment_text: z.string({ required_error: 'Comment text is required' }),
});

const editCommentSchema = z.object({
  commentId: z.string({ required_error: 'Comment ID is required' }),
  comment_text: z.string({ required_error: 'Comment text is required' }),
});

module.exports = {
  getCommentsSchema,
  postCommentSchema,
  editCommentSchema,
};
