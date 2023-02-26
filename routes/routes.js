const express = require('express');
const Data = require('../models/model');
const User = require('../models/user');
const TrainSchedule = require('../models/trainSchedule');
const Wallet = require('../models/wallet');
const Station = require('../models/station');
const Schedule = require('../models/schedule');
const Passenger = require('../models/passengers');


var bodyParser = require('body-parser');
const trainSchedule = require('../models/trainSchedule');
const { model } = require('mongoose');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const router = express.Router()

async function checkout(user,outTime,trainId){
    //isInside false

        const station = Schedule.findOne({trainId:trainId,timestamp:outTime})
        const outStationId = station.stationId
        const outStation = Station.findOne({stationId:outStationId})
        const outStationName = outStation.stationName
    
        const insideStation = Data.findOne({userId:user,isInside:True})
        const inStation = insideStation.inStation
        Data.findOneAndUpdate({userId:user,isInside:true},{$set:{isInside:false,outStation:outStationName,outTime:outTime}},{new: true},(err,doc)=>{
            if (err) {
                console.log(err.message);
            }
            }) 
     const noOfStations = Math.abs(inStation-outStationId)
     const price = noOfStations*2
     processPay(user,price)
     res.send(outStation,price)
}

async function processPay(user,price){
    Wallet.findOne
    const wallet = await Wallet.findOne({userId:user})
    const walletBalance = wallet.walletBalance
    const newBalance = walletBalance-price
    if(newBalance<0){
        res.send("Insufficient Balance")
    }
    else{
        Wallet.findOneAndUpdate({userId:user},{$set:{walletBalance:(newBalance)}},{new: true},(err,doc)=>{
            if (err) {
                console.log(err.message);
            }
            })
    }
}

//no of downs, no of ups

async function checkin(user,inTime,trainId){
    //evaluate station getting corresponding stationId from station model
   const station = Schedule.findOne({trainId:trainId,timestamp:inTime})
   const inStationId = station.stationId
   const inStation = Station.findOne({stationId:inStationId})
   const inStationName = inStation.stationName   

    //isInside true
        const newData = new Data({
            userId : user,
            inTime:  inTime,
            trainId: trainId,
            isInside: true,
            inStation:inStationName
        })
        const data = await newData.save()
}




router.post('/ping', jsonParser, async(req, res) => {
    try{
        const trainId = req.body.trainId
        const user = req.body.user
        const timestamp = req.body.timestamp

        const isUser = await Data.findOne({userId:user})
        //doubt about timestamp
        const isTimestamp = await Data.findOne({inTime:timestamp})


    if(isUser){
        if(isUser.isInside){
            console.log("found")
            checkout(user,timestamp,trainId)
        }
      
        //reroute to checkout
    }
    else{
        checkin(user,timestamp,trainId)
    }
    }
    catch(err){
        console.log(err)
    }
    res.send(req.body)

})

router.post('/doors',jsonParser, async(req,res)=>{
     const totalInside = req.body.totalInside
     const totalOutside = req.body.totalOutside
     const trainId = req.body.trainId

    const passengers = await Passenger.findOne({trainId:trainId})
    console.log(passengers)
    totalPassengers = passengers.noOfPassengers+(totalInside-totalOutside)
    Passenger.findOneAndUpdate({trainId:trainId},{$set:{noOfPassengers:totalPassengers}},{new: true},(err,doc)=>{
            if (err) {
                console.log(err.message);
            }
            }) 
    const count = await Schedule.count({trainId:trainId})
    console.log(count)

    
    if(totalPassengers!=count){
        console.log("check the compartment")
        res.send("check the compartment")
    }
    else{
        console.log("everything alright")
        res.send("everything alright")
    }
})

//Get all Method
router.get('/ping', (req, res) => {
    res.send('Get All API')
})

router.post('/wallet',jsonParser, async(req, res) => {
    const newWallet = new Wallet({
        walletId : req.body.walletId,
        walletBalance:  req.body.walletBalance,
        userId: req.body.user,
    })
    const wallet = await newWallet.save()
    res.send(wallet)
})
router.post('/station',jsonParser, async(req, res) => {
    const newStation = new Station({
        stationId : req.body.stationId,
        stationName:  req.body.stationName,
    })
    const station = await newStation.save()
    res.send(station)
})
router.post('/schedule',jsonParser, async(req, res) => {
    const newSchedule = new Schedule({
        trainId : req.body.trainId,
        stationId:  req.body.stationId,
        timestamp: req.body.timestamp
    })
    const schedule = await newSchedule.save()
    res.send(schedule)
})
router.post('/user',jsonParser, async(req, res) => {
    const newUser = new User({
        name : req.body.name,
        userId:  req.body.userId,
        walletId:req.body.walletId
    })
    const user = await newUser.save()
    res.send(user)
})
router.post('/passenger',jsonParser, async(req, res) => {
    const newPassenger = new Passenger({
        noOfPassengers : req.body.passengers,
        trainId: req.body.trainId,
    })
    const passenger = await newPassenger.save()
    res.send(passenger)

})
router.post('/checkout', (req, res) => {
    res.send('Get checkout API')
})
router.post('/checkout', (req, res) => {
    res.send('Get checkout API')
})

//Get by ID Method
router.get('/doors', (req, res) => {
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