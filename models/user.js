const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        // required: true
    },
    userId: {
        //required: true,
        type: Number
    },
    walletId: {
       // required: true,
        type: Number
    }
})

module.exports = mongoose.model('User', userSchema)