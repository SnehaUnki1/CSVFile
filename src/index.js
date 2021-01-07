var express = require("express");
const fs = require("fs");
const neatCsv = require("neat-csv");
const math = require("mathjs");
const multer = require("multer");
const fileUpload = require("express-fileupload");
var app = express();

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "csvData";
const collection = "csv";
var db;

app.use(fileUpload());
const id = new ObjectID();
MongoClient.connect(connectionURL, (err, client) => {
  if (err) return console.error(err);
  db = client.db(databaseName);

  console.log("Connected to Database");
});

app.use(express.json());

const port = process.env.PORT || 8080;
var csvdata = [];

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

app.post("/uploadfile", upload.single("file"), (req, res, next) => {
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
app.post("/insertData", (req, res) => {
  console.log(csvdata);
  db.collection(collection).insert(csvdata, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send(result);
  });
});

//fetching data from db
app.get("/getdata", (req, res) => {
  db.collection(collection)
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);

      res.send(result);
    });
});

app.listen(port, () => console.log(`Listening to the port ${port}....`));
