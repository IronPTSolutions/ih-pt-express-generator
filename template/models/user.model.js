const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const faker = require('faker');

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
};

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [3, 'Name needs at last 3 chars'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [EMAIL_PATTERN, 'Email is invalid'],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        avatar: {
            type: String,
            default: faker.image.avatar,
        },
        password: {
            type: String,
            minlength: [8, 'Password min length is 8'],
        },
        activation: {
            active: {
                type: Boolean,
                default: false,
            },
            token: {
                type: String,
                default: generateRandomToken,
            },
        },
        social: {
            slack: String,
        },
    },
    { timestamps: true },
);

schema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10).then((hash) => {
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

schema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', schema);

module.exports = User;
