const Schema = require('mongoose').Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255,
        select: false
    }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);
