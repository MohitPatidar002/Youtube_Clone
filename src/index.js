
require("dotenv").config();
const express = require("express");
const dbConnect = require("./db/dbconnection");
const app = express();

dbConnect()
.then(() => {
    app.listen(process.env.PORT || 8000,(req,res) => {
        console.log("app started at port ", process.env.PORT)
    })
})
.catch((err) => {
    console.log("Port err", err)
})

