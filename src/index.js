var express = require("express");
// const fileUpload = require("express-fileupload");
const routerCsv = require('./router/routerData')
const math = require("mathjs");

var app = express();

// app.use(fileUpload())
app.use(express.json());
app.use('/csv',routerCsv)
// app.use(express.json());


// function deciRound() {
//     // var data1 = [];
//     data =[{a:12.43545,b:12.4535},{a:12.43545,b:12.4535},{a:12.43545,b:12.4535}]
//     // data = data.forEach(item => {
//     //     math.round(item.a, 2)
//     // })
//    const csv = data.map((item) => {
//         const data1 ={};
//          data1.a =math.round(parseFloat(item.Height(Inches)), 2);
//          data1.b =math.round(parseFloat(item.Weight(Pounds)), 2);
//          return data1
   
      
      
//     });
//     console.log("deci:",csv)
// }

// deciRound();
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening to the port ${port}....`));
