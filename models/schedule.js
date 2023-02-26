const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    trainId: {
        // required: true,
        type: String
    },
    stationId: {
        type: String
    },
    timestamp:{
        type: Number
    }
})

module.exports = mongoose.model('Schedule', scheduleSchema)