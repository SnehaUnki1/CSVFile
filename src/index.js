var express = require("express");
const fileUpload = require("express-fileupload");
const routerCsv = require('./router/routerData')
var app = express();

app.use(fileUpload());
app.use(express.json());
app.use('/csv',routerCsv)
app.use(express.json());

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening to the port ${port}....`));
