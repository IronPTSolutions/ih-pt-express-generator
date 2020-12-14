const mongoose = require('mongoose');
const User = require('../models/user.model');
const nodemailer = require('../config/mailer.config');
const passport = require('passport');

const DUPLICATED_USER = 11000;

module.exports.login = (req, res, next) => {
    res.render('users/login');
};

module.exports.doSocialLogin = (req, res, next) => {
    const passportController = passport.authenticate('slack', (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect('/');
        }
    });

    passportController(req, res, next);
};

module.exports.doLogin = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                user.checkPassword(req.body.password).then((match) => {
                    if (match) {
                        if (user.activation.active) {
                            req.session.userId = user._id;

                            res.redirect('/');
                        } else {
                            res.render('users/login', {
                                error: {
                                    email: {
                                        message: 'Your account is not active.',
                                    },
                                },
                            });
                        }
                    } else {
                        res.render('users/login', {
                            error: {
                                email: {
                                    message: 'User not found.',
                                },
                            },
                        });
                    }
                });
            } else {
                res.render('users/login', {
                    error: {
                        email: {
                            message: 'User not found.',
                        },
                    },
                });
            }
        })
        .catch(next);
};

module.exports.signup = (req, res, next) => {
    res.render('users/signup');
};

module.exports.createUser = (req, res, next) => {
    const user = new User({
        ...req.body,
        avatar: req.file ? req.file.path : undefined,
    });

    user.save()
        .then((user) => {
            nodemailer.sendValidationEmail(user.email, user.activation.token, user.name);

            res.redirect('/login');
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('users/signup', { error: error.errors, user });
            } else if (error.code === DUPLICATED_USER) {
                res.render('users/signup', {
                    user,
                    error: {
                        email: {
                            message: 'User already exists.',
                        },
                    },
                });
            } else {
                next(error);
            }
        })
        .catch(next);
};

module.exports.activateUser = (req, res, next) => {
    User.findOne({ 'activation.token': req.params.token })
        .then((user) => {
            if (user) {
                user.activation.active = true;
                user.save()
                    .then((user) => {
                        res.redirect('/login');
                    })
                    .catch(next);
            } else {
                res.redirect('/login');
            }
        })
        .catch((e) => next);
};

module.exports.logout = (req, res, next) => {
    req.session.destroy();

    res.redirect('/login');
};
