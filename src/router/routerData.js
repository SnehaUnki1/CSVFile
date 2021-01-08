const express = require('express')
const neatCsv = require('neat-csv')
const math = require('mathjs')
const multer = require('multer')
const { MongoClient, ObjectID } = require('mongodb')
const fileValidate = require('./fileValidate')
const path = require('path')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'csvData'
const collectionName = 'csv'
const router = express.Router()

var csvdata = []
var csvDataFinal = []
var db
const id = new ObjectID()
MongoClient.connect(connectionURL, (err, client) => {
  if (err) return console.error(err)
  db = client.db(databaseName)

  console.log('Connected to Database')
})

// file validation
const upload = multer({
  
  fileFilter (req, file, cb){
    if(!file){
      return cb(new Error("Plese upload the file"))

    }
     else if(!file.originalname.match(/\.(csv|CSV)$/)){
          return cb(new Error("Please upload CSV FIles"))
      }
      cb(undefined,true)   
  }
})

router.post('/uploadfile',upload.single('filecsv'),(req, res, next) => {
  
      (async () => {
        csvdata = await neatCsv(req.file.buffer)
      })();
    
      res.send(csvdata)
},(error, req, res, next) =>{
  res.status(400).send({error :error.message})
})


// reading the file data

function deciRound () {
  csvDataFinal = csvdata.map(item => {
    // console.log(item.Height);
    const data1 = {}
    data1.Height = math.round(item.Height, 2)
    data1.Weight = math.round(item.Weight, 2)

    return data1
  })
}

// inserting the data in to db
router.post('/insertData', (req, res) => {
  deciRound()
  // console.log(csvDataFinal);
  db.collection(collectionName).insertMany(csvDataFinal, (error, result) => {
    if (error) {
      return res.status(500).send(error)
    }
    res.send(result)
  })
})

//fetching data from db
router.get('/getdata', (req, res) => {
  db.collection(collectionName)
    .find({})
    .toArray(function (err, result) {
      if (err) throw err
      console.log(result)

      res.send(result)
    })
})

module.exports = router
