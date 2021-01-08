var express = require("express");
const routerCsv = require('./router/routerData')
const math = require("mathjs");

var app = express();

app.use(express.json());
app.use('/csv',routerCsv)

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening to the port ${port}....`));
