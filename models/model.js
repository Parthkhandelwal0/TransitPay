const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: {
        type:Number,
        unique: false
    },

    trainId: {
        type: Number
    },
    inTime:{
        type: Number
    },
    outTime:{
        type: Number
    },
    inStation:{
        type: Number
    },
    outStation:{
        type: Number
    },
    isInside:{
        type:Boolean
    }
})

module.exports = mongoose.model('Data', dataSchema)