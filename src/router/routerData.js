const express = require('express');
const neatCsv = require("neat-csv");
const math = require("mathjs");
const multer = require("multer");
const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "csvData";
const collectionName = "csv";
const router = express.Router()

var csvdata = [];
var db;
const id = new ObjectID();
MongoClient.connect(connectionURL, (err, client) => {
  if (err) return console.error(err);
  db = client.db(databaseName);

  console.log("Connected to Database");
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

router.post("/uploadfile", upload.single("file"), (req, res, next) => {
  const file = req.files.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
   (async () => {
    csvdata = await neatCsv(file.data);
  })();

  res.send(csvdata);
});

// reading the file data

function deciRound() {
  csvdata.map((item) => {
    math.round(parseFloat(item.Height), 2);
    math.round(parseFloat(item.Weight), 2);
  });
}

// inserting the data in to db
router.post("/insertData", (req, res) => {
  console.log(csvdata);
  db.collection(collectionName).insertMany(csvdata, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send(result);
  });
});

//fetching data from db
router.get("/getdata", (req, res) => {
  db.collection(collectionName)
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);

      res.send(result);
    });
});

module.exports = router