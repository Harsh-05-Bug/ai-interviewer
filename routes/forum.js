const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Get all posts (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, sort = 'newest', search, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj = { isPinned: -1, createdAt: -1 };
    if (sort === 'oldest') sortObj = { isPinned: -1, createdAt: 1 };
    if (sort === 'popular') sortObj = { isPinned: -1, 'upvotes.length': -1, createdAt: -1 };
    if (sort === 'most-commented') sortObj = { isPinned: -1, 'comments.length': -1, createdAt: -1 };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .select('userId userName userAvatar title content category tags upvotes downvotes comments views isPinned createdAt')
      .sort(sortObj)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const sanitized = posts.map(p => ({
      ...p,
      upvoteCount: p.upvotes?.length || 0,
      downvoteCount: p.downvotes?.length || 0,
      commentCount: p.comments?.length || 0,
      score: (p.upvotes?.length || 0) - (p.downvotes?.length || 0),
      comments: undefined, // Don't send full comments in list
    }));

    res.json({ success: true, posts: sanitized, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });

    // Increment views
    await Post.updateOne({ _id: req.params.id }, { $inc: { views: 1 } });

    post.upvoteCount = post.upvotes?.length || 0;
    post.downvoteCount = post.downvotes?.length || 0;
    post.score = post.upvoteCount - post.downvoteCount;
    post.comments = (post.comments || []).map(c => ({
      ...c,
      upvoteCount: c.upvotes?.length || 0,
    }));

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, error: 'Title and content required.' });
    if (title.length < 5) return res.status(400).json({ success: false, error: 'Title must be at least 5 characters.' });
    if (content.length < 10) return res.status(400).json({ success: false, error: 'Content must be at least 10 characters.' });

    const user = await User.findById(req.user._id);
    const post = await Post.create({
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatar,
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
      tags: tags || [],
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upvote/downvote post
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });

    const userId = req.user._id;
    const hasUpvoted = post.upvotes.includes(userId);
    const hasDownvoted = post.downvotes.includes(userId);

    // Remove existing vote
    post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
    post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());

    // Toggle vote
    if (type === 'up' && !hasUpvoted) post.upvotes.push(userId);
    if (type === 'down' && !hasDownvoted) post.downvotes.push(userId);

    await post.save();
    res.json({
      success: true,
      upvoteCount: post.upvotes.length,
      downvoteCount: post.downvotes.length,
      score: post.upvotes.length - post.downvotes.length,
      userVote: post.upvotes.includes(userId) ? 'up' : post.downvotes.includes(userId) ? 'down' : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add comment
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.length < 2) return res.status(400).json({ success: false, error: 'Comment too short.' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });

    const user = await User.findById(req.user._id);
    post.comments.push({
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatar,
      content: content.trim(),
    });

    await post.save();
    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({ success: true, comment: { ...newComment.toObject(), upvoteCount: 0 } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upvote comment
router.post('/:id/comment/:commentId/upvote', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, error: 'Comment not found.' });

    const userId = req.user._id;
    const hasUpvoted = comment.upvotes.includes(userId);

    if (hasUpvoted) {
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      comment.upvotes.push(userId);
    }

    await post.save();
    res.json({ success: true, upvoteCount: comment.upvotes.length, upvoted: !hasUpvoted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete post (own or admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });
    if (post.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }
    await Post.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete comment (own or admin)
router.delete('/:id/comment/:commentId', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, error: 'Comment not found.' });
    if (comment.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }

    post.comments.pull(req.params.commentId);
    await post.save();
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get category stats
router.get('/meta/stats', async (req, res) => {
  try {
    const stats = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const totalPosts = await Post.countDocuments();
    const totalComments = await Post.aggregate([
      { $project: { commentCount: { $size: '$comments' } } },
      { $group: { _id: null, total: { $sum: '$commentCount' } } },
    ]);
    res.json({ success: true, categories: stats, totalPosts, totalComments: totalComments[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;