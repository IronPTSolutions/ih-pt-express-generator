const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const postsController = require('../controllers/posts.controller');
const sessionMiddleware = require('../middlewares/session.middleware');
const uploads = require('../config/multer.config');

router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.doSocialLogin);
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.login);
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin);
router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.signup);
router.post('/signup', sessionMiddleware.isNotAuthenticated, uploads.single('avatar'), usersController.createUser);
router.get('/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);
router.post('/logout', sessionMiddleware.isAuthenticated, usersController.logout);

router.get('/posts', sessionMiddleware.isAuthenticated, postsController.list);
router.get('/posts/new', sessionMiddleware.isAuthenticated, postsController.create);
router.post('/posts', sessionMiddleware.isAuthenticated, uploads.single('image'), postsController.doCreate);
router.get('/posts/:id', sessionMiddleware.isAuthenticated, postsController.detail);
router.get('/posts/:id/edit', sessionMiddleware.isAuthenticated, postsController.edit);
router.post('/posts/:id/edit', sessionMiddleware.isAuthenticated, uploads.single('image'), postsController.doEdit);
router.post('/posts/:id/delete', sessionMiddleware.isAuthenticated, postsController.delete);

router.get('/', (req, res) => res.redirect('/posts'));

module.exports = router;
