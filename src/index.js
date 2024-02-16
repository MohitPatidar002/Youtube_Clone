
require("dotenv").config();
const dbConnect = require("./db/dbconnection");
const app = require('./app.js');


dbConnect()
.then(() => {
    app.listen(process.env.PORT || 8000,(req,res) => {
        console.log("app started at port ", process.env.PORT)
    })
})
.catch((err) => {   
    console.log("Port err", err)
})

