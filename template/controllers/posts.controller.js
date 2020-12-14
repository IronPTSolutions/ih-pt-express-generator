const mongoose = require('mongoose');
const Post = require('../models/post.model');

module.exports.list = (req, res, next) => {
    const filters = req.query;

    Post.find(filters)
        .populate('author')
        .then((posts) => {
            res.render('posts/list', { posts });
        })
        .catch(next);
};

module.exports.create = (req, res, next) => {
    const post = new Post();

    res.render('posts/new', { post });
};

module.exports.doCreate = (req, res, next) => {
    console.log('body', req.body);
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        image: req.file ? req.file.path : undefined,
        author: req.currentUser.id,
    });

    post.save()
        .then((post) => {
            res.redirect(`/posts/${post.id}`);
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('posts/new', { error: error.errors, post });
            } else {
                next(error);
            }
        });
};

module.exports.detail = (req, res, next) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (post) {
                res.render('posts/detail', { post });
            } else {
                res.redirect('/posts');
            }
        })
        .catch(next);
};

module.exports.edit = (req, res, next) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (post) {
                res.render('posts/edit', { post });
            } else {
                res.redirect('/posts');
            }
        })
        .catch(next);
};

module.exports.doEdit = (req, res, next) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (post) {
                Object.assign(post, {
                    title: req.body.title,
                    description: req.body.description,
                    image: req.file ? req.file.path : post.image,
                });

                post.save()
                    .then((post) => {
                        res.render('posts/detail', { post });
                    })
                    .catch((error) => {
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.render('posts/edit', { error: error.errors, post });
                        } else {
                            next(error);
                        }
                    });
            } else {
                res.redirect('/posts');
            }
        })
        .catch(next);
};

module.exports.delete = (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/posts');
        })
        .catch(next);
};
