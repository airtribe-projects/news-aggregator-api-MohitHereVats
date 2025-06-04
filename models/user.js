const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    preferences: {
        type: [String],
        default: [],
    },
    articles: {
        type: [Object],
        default: [],
    },
    read: {
        type: [String],
        default: [],
    },
    favorites: {
        type: [String],
        default: [],
    },
});

userSchema.methods.generateAuthToken = function() {
    const user = {
        id: this._id,
        name: this.name,
        email: this.email,
        // preferences: this.preferences,
    }
    const token = jwt.sign(user, process.env.jwtSecret, {
        expiresIn: '1h',
    });
    if (!token) {
        throw new Error('Error generating token');
    }
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;