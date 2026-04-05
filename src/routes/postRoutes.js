const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const {
  createPostValidator,
  addCommentValidator,
  addReplyValidator,
  togglePostLikeValidator,
  toggleCommentLikeValidator,
  toggleReplyLikeValidator
} = require('../validators/postValidators');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get feed posts (public + private own posts)
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Feed fetched
 */
router.get('/', asyncHandler(postController.getFeed));

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string }
 *               image: { type: string }
 *               visibility: { type: string, enum: [public, private] }
 *     responses:
 *       201:
 *         description: Post created
 */
router.post('/', createPostValidator, validate, asyncHandler(postController.createPost));

/**
 * @swagger
 * /api/posts/{postId}/likes:
 *   patch:
 *     summary: Toggle like on a post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Toggled like
 */
router.patch('/:postId/likes', togglePostLikeValidator, validate, asyncHandler(postController.togglePostLike));

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Add comment to a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string }
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/:postId/comments', addCommentValidator, validate, asyncHandler(postController.addComment));

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}/likes:
 *   patch:
 *     summary: Toggle like on a comment
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Toggled comment like
 */
router.patch(
  '/:postId/comments/:commentId/likes',
  toggleCommentLikeValidator,
  validate,
  asyncHandler(postController.toggleCommentLike)
);

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}/replies:
 *   post:
 *     summary: Add reply to comment
 *     tags: [Replies]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string }
 *     responses:
 *       201:
 *         description: Reply added
 */
router.post(
  '/:postId/comments/:commentId/replies',
  addReplyValidator,
  validate,
  asyncHandler(postController.addReply)
);

/**
 * @swagger
 * /api/posts/{postId}/comments/{commentId}/replies/{replyId}/likes:
 *   patch:
 *     summary: Toggle like on a reply
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: replyId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Toggled reply like
 */
router.patch(
  '/:postId/comments/:commentId/replies/:replyId/likes',
  toggleReplyLikeValidator,
  validate,
  asyncHandler(postController.toggleReplyLike)
);

module.exports = router;
