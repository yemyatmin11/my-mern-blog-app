const express = require('express');
const UserController = require('../controllers/UserController');
const { body } = require('express-validator');
const handleErrorMessage = require('../middlewares/handleErrorMessage');
const User = require('../Models/User');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const upload = require('../helpers/upload')

const router = express.Router();

router.get('/me', AuthMiddleware,UserController.me);

router.get('/:id', UserController.getUserById);

router.post('/login', UserController.login);

router.post('/logout', UserController.logout);

router.post('/register', [
    body('name').notEmpty(),
    body('email').notEmpty(),
    body('email').custom(async value => {
        const user = await User.findOne({ email : value});
        if (user) {
          throw new Error('already in use');
        }
    }),
    body('password').notEmpty()
], handleErrorMessage, UserController.register);

router.post('/:id/upload', [
  upload.single('photo'),
  body('photo').custom((value, {req}) => {
    if(!req.file) {
      throw new Error('Photo is required');
    };

    if(!req.file.mimetype.startsWith('image')) {
      throw new Error('Photo must be image');
    };

    return true;
  })
], handleErrorMessage ,UserController.upload)

router.patch('/:id', [
  body('name').notEmpty(),
    body('email').notEmpty(),
    body('email').custom(async value => {
        const user = await User.findOne({ email : value});
        if (user) {
          throw new Error('already in use');
        }
    }),
    body('password').notEmpty()
], handleErrorMessage, UserController.update);

router.delete('/:id', UserController.destroy);

module.exports = router;