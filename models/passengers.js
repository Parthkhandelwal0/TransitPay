const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    noOfPassengers: {
        type:Number,
        unique: false
    },

    trainId: {
        type: Number
    }
})

module.exports = mongoose.model('Passenger', passengerSchema)