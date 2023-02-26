const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    walletId: {
        // required: true,
        type: String
    },
    walletBalance: {
        type: String
    },
    userId:{
        type: Number
    }
})

module.exports = mongoose.model('Wallet', walletSchema)