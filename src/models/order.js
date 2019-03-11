const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        unitValue: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        }
    }],
    createdDate: {
        type: Date,
        default: Date.now
    },
    totalValue: {
        type: Number,
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['New', 'Waiting', 'Doing', 'Done'],
        required: true,
        default: 'New'
    }
})

module.exports = mongoose.model('Order', orderSchema);