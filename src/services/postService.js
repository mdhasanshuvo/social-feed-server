const xss = require('xss');
const Post = require('../models/Post');
const ApiError = require('../utils/apiError');

const feedSelect =
  'author text image visibility createdAt likes comments.author comments.text comments.createdAt comments.likes comments.replies';

const feedPopulate = [
  { path: 'author', select: 'firstName lastName email' },
  { path: 'likes.user', select: 'firstName lastName email' },
  { path: 'comments.author', select: 'firstName lastName email' },
  { path: 'comments.likes.user', select: 'firstName lastName email' },
  { path: 'comments.replies.author', select: 'firstName lastName email' },
  { path: 'comments.replies.likes.user', select: 'firstName lastName email' }
];

const getFeed = async (currentUserId) => {
  return Post.find({
    $or: [{ visibility: 'public' }, { author: currentUserId }]
  })
    .sort({ createdAt: -1 })
    .select(feedSelect)
    .populate(feedPopulate)
    .lean();
};

const createPost = async (currentUserId, payload) => {
  const post = await Post.create({
    author: currentUserId,
    text: xss(payload.text),
    image: payload.image || '',
    visibility: payload.visibility || 'public'
  });

  return Post.findById(post._id).populate({ path: 'author', select: 'firstName lastName email' });
};

const toggleUserLike = (likes, userId) => {
  const existingIndex = likes.findIndex((item) => item.user.toString() === userId.toString());
  if (existingIndex >= 0) {
    likes.splice(existingIndex, 1);
    return 'unliked';
  }

  likes.push({ user: userId });
  return 'liked';
};

const togglePostLike = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const action = toggleUserLike(post.likes, userId);
  await post.save();

  await post.populate({ path: 'likes.user', select: 'firstName lastName email' });

  return { action, likes: post.likes };
};

const addComment = async (postId, userId, text) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  post.comments.push({ author: userId, text: xss(text), likes: [], replies: [] });
  await post.save();

  const comment = post.comments[post.comments.length - 1];
  await post.populate({ path: 'comments.author', select: 'firstName lastName email' });

  return post.comments.id(comment._id);
};

const toggleCommentLike = async (postId, commentId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  const action = toggleUserLike(comment.likes, userId);
  await post.save();
  await post.populate({ path: 'comments.likes.user', select: 'firstName lastName email' });

  return { action, likes: post.comments.id(commentId).likes };
};

const addReply = async (postId, commentId, userId, text) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  comment.replies.push({ author: userId, text: xss(text), likes: [] });
  await post.save();

  const reply = comment.replies[comment.replies.length - 1];
  await post.populate({ path: 'comments.replies.author', select: 'firstName lastName email' });

  return post.comments.id(commentId).replies.id(reply._id);
};

const toggleReplyLike = async (postId, commentId, replyId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  const reply = comment.replies.id(replyId);
  if (!reply) {
    throw new ApiError(404, 'Reply not found');
  }

  const action = toggleUserLike(reply.likes, userId);
  await post.save();

  await post.populate({ path: 'comments.replies.likes.user', select: 'firstName lastName email' });

  return {
    action,
    likes: post.comments.id(commentId).replies.id(replyId).likes
  };
};

module.exports = {
  getFeed,
  createPost,
  togglePostLike,
  addComment,
  toggleCommentLike,
  addReply,
  toggleReplyLike
};
