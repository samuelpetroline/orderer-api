const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dashboardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    value: {
        type: Number,
        required: true
    },
    stockControl: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Dashboard', dashboardSchema);