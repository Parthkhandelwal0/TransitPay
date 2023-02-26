const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    stationId: {
        // required: true,
        type: Number
    },
    stationName: {
        type: String
    },
   
})

module.exports = mongoose.model('Station', stationSchema)