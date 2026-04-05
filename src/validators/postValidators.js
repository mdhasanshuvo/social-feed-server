const { body, param } = require('express-validator');

const mongoIdParam = (name) => param(name).isMongoId().withMessage(`${name} must be a valid id`);

const createPostValidator = [
  body('text').trim().notEmpty().withMessage('Post text is required').isLength({ max: 3000 }),
  body('image').optional().trim().isURL().withMessage('Image must be a valid URL'),
  body('visibility').optional().isIn(['public', 'private']).withMessage('Visibility must be public or private')
];

const addCommentValidator = [
  mongoIdParam('postId'),
  body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 })
];

const addReplyValidator = [
  mongoIdParam('postId'),
  mongoIdParam('commentId'),
  body('text').trim().notEmpty().withMessage('Reply text is required').isLength({ max: 1000 })
];

const togglePostLikeValidator = [mongoIdParam('postId')];
const toggleCommentLikeValidator = [mongoIdParam('postId'), mongoIdParam('commentId')];
const toggleReplyLikeValidator = [mongoIdParam('postId'), mongoIdParam('commentId'), mongoIdParam('replyId')];

module.exports = {
  createPostValidator,
  addCommentValidator,
  addReplyValidator,
  togglePostLikeValidator,
  toggleCommentLikeValidator,
  toggleReplyLikeValidator
};
