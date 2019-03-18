const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        index: true
    },
    phone: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    address: {
        type: {
            street: {
                type: String,
                required: true
            },
            quarter: {
                type: String,
                required: true
            },
            number: {
                type: Number,
                required: true
            },
            complement: {
                type: String
            },
            zipcode: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            }
        },
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (!this.isModified('password') || !this.isNew) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.authenticatePassword = function (password, done) {
    var user = this;
    bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) return done(err);
        done(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);