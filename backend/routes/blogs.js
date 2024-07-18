const express = require('express');
const BlogController = require('../controllers/BlogController');
const { body } = require('express-validator');
const handleErrorMessage = require('../middlewares/handleErrorMessage');
const upload = require('../helpers/upload');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

const router = express.Router();

router.get('', BlogController.index);

router.get('/search', BlogController.search);

router.post('', AuthMiddleware,[
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('categories').notEmpty().isArray({ min : 2 })
], handleErrorMessage ,BlogController.store);

router.get('/:id',BlogController.show);

router.get('/:userId/blogs', AuthMiddleware,BlogController.getUserBlogs);

router.post('/:id/upload', [
    upload.single('photo'),
    body('photo').custom((value, { req }) => {
        if(!req.file) {
            throw new Error('Photo is required');
        }

        if(!req.file.mimetype.startsWith('image')) {
            throw new Error('Photo must be image');
        }

        return true;
    })
], handleErrorMessage,BlogController.upload);

router.delete('/:id', BlogController.destroy);

router.patch('/:id', BlogController.update);

module.exports = router;