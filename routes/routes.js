const express = require('express');
const Data = require('../models/model');
const User = require('../models/user');
const TrainSchedule = require('../models/trainSchedule');
const Wallet = require('../models/wallet');
const Station = require('../models/station');
const Schedule = require('../models/schedule');

var bodyParser = require('body-parser');
const trainSchedule = require('../models/trainSchedule');
const { model } = require('mongoose');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const router = express.Router()

async function checkout(user,outTime,trainId){
    //isInside false
    Data.findOneAndUpdate({userId:user,isInside:true},{$set:{isInside:false}},{new: true},(err,doc)=>{
        if (err) {
            console.log(err.message);
        }
        }) 
    
    //const isUser = await Data.findOne({userId:user})
    //const inStation = User.inStation
     const outStation = trainId + outTime
     const noOfStations = abs(inStation-outStation)
}


async function checkin(user,inTime,trainId){
    //evaluate station getting corresponding stationId from station model

    //isInside true
        const newData = new Data({
            userId : user,
            inTime:  inTime,
            trainId: trainId,
            isInside: true
        })
        const data = await newData.save()

}


//Post Method
router.post('/post', (req, res) => {
    res.send('Post API')
})
 


router.post('/ping', jsonParser, async(req, res) => {
    try{
        const trainId = req.body.trainId
        const user = req.body.user
        const timestamp = req.body.timestamp
        console.log(user)

        const isUser = await Data.findOne({userId:user})
        const isTimestamp = await Data.findOne({inTime:timestamp})


    if(isUser && isTimestamp){
        console.log("found")
       checkout(user,timestamp,trainId)
        //reroute to checkout
    }
    else{

        checkin(user,timestamp,trainId)
        //reroute to checking
        // const newData = new Data({
        //     userId : req.body.user,
        //     inTime:  req.body.timestamp,
        //     isInside: true
        // })
        // const data = await newData.save()
    }
    }
    catch(err){
        console.log(err)
    }
    res.send(req.body)

})

router
//Get all Method
router.get('/ping', (req, res) => {
    res.send('Get All API')
})

router.post('/checkout', (req, res) => {
    res.send('Get checkout API')
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send('Get by ID API')
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})

module.exports = router;