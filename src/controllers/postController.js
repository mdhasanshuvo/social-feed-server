const postService = require('../services/postService');
const uploadService = require('../services/uploadService');
const ApiError = require('../utils/apiError');

const getFeed = async (req, res) => {
  const data = await postService.getFeed(req.user._id);
  return res.status(200).json({ success: true, data });
};

const createPost = async (req, res) => {
  const data = await postService.createPost(req.user._id, req.body);
  return res.status(201).json({ success: true, message: 'Post created', data });
};

const togglePostLike = async (req, res) => {
  const data = await postService.togglePostLike(req.params.postId, req.user._id);
  return res.status(200).json({ success: true, message: `Post ${data.action}`, data });
};

const addComment = async (req, res) => {
  const data = await postService.addComment(req.params.postId, req.user._id, req.body.text);
  return res.status(201).json({ success: true, message: 'Comment added', data });
};

const toggleCommentLike = async (req, res) => {
  const data = await postService.toggleCommentLike(req.params.postId, req.params.commentId, req.user._id);
  return res.status(200).json({ success: true, message: `Comment ${data.action}`, data });
};

const addReply = async (req, res) => {
  const data = await postService.addReply(req.params.postId, req.params.commentId, req.user._id, req.body.text);
  return res.status(201).json({ success: true, message: 'Reply added', data });
};

const toggleReplyLike = async (req, res) => {
  const data = await postService.toggleReplyLike(
    req.params.postId,
    req.params.commentId,
    req.params.replyId,
    req.user._id
  );
  return res.status(200).json({ success: true, message: `Reply ${data.action}`, data });
};

const uploadPostImage = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const imageUrl = await uploadService.uploadImageBuffer(req.file.buffer);
  return res.status(200).json({ success: true, message: 'Image uploaded', data: { imageUrl } });
};

module.exports = {
  getFeed,
  createPost,
  togglePostLike,
  addComment,
  toggleCommentLike,
  addReply,
  toggleReplyLike,
  uploadPostImage
};
