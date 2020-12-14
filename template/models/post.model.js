const mongoose = require('mongoose');
const faker = require('faker');
const User = require('./user.model');

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            default: faker.image.image,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User.modelName,
            required: true,
        },
    },
    { timestamps: true },
);

const Post = mongoose.model('Post', schema);

module.exports = Post;
