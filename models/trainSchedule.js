const mongoose = require('mongoose');

const trainScheduleSchema = new mongoose.Schema({
    trainId: {
        // required: true,
        type: String
    },
    station: {
        type: String
        
    },
    timestamp:{
        type: Number
    }
})

module.exports = mongoose.model('TrainSchedule', trainScheduleSchema)