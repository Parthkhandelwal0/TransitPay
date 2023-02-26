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

        const station = await Schedule.findOne({timestamp:outTime})
        const outStationId = station.stationId
        const outStation = Station.findOne({stationId:outStationId})
        // const outStationName = outStation.stationName
    
        const insideStation = await Data.findOne({userId:user})
        console.log(insideStation.inStation)
        const inStationId = insideStation.inStation

        // const inStation = insideStation.inStationId
        Data.findOneAndUpdate({userId:user,isInside:true},{$set:{isInside:false,outStation:outStationId,outTime:outTime}},{new: true},(err,doc)=>{
            if (err) {
                console.log(err.message);
            }
            }) 
     const noOfStations = Math.abs(inStationId-outStationId)
     console.log(noOfStations)
     const price = noOfStations*2
     console.log(price)
     processPay(user,price)     
}

async function processPay(user,price){
    // Wallet.findOne
    const wallet = await Wallet.findOne({userId:user})
    const walletBalance = wallet.walletBalance
    const newBalance = walletBalance-price
    if(newBalance<0){
        console.log("Insufficient Balance")
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
   const station = await Schedule.findOne({timestamp:inTime})
   const inStationId = station.stationId
   console.log(inStationId)
   const inStation = Station.findOne({stationId:inStationId})
   const inStationName = inStation.stationName   

    //isInside true
        const newData = new Data({
            userId : user,
            inTime:  inTime,
            trainId: trainId,
            isInside: true,
            inStation:inStationId
        })
        const data = await newData.save()

        return inStationId
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
            res.send("checkout complete")

        }
          }
    else{
     checkin(user,timestamp,trainId)
     res.send("checkin complete")
    }
    }
    catch(err){
        console.log(err)
    }

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
    const count = await Data.count({isInside:true})
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

module.exports = router;