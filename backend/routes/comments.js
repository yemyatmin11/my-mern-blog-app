const express = require('express');
const CommentController = require('../controllers/CommentController');

const router = express.Router();

router.post('', CommentController.store);

router.delete('/:id', CommentController.destroy);

router.patch('/:id', CommentController.update);

router.get('/post/:postId', CommentController.getPostComments);

module.exports = router;