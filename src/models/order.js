const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        item: {
            type: Schema.ObjectId,
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
        enum: ['Novo', 'Em espera', 'Produzindo', 'Finalizado'],
        required: true,
        default: 'Novo'
    }
})

module.exports = mongoose.model('Order', orderSchema);