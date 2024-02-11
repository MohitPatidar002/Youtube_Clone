
require("dotenv").config();
const express = require("express");
const { dbConnect } = require("./db/dbconnection");
const app = express();

dbConnect;

app.listen(process.env.PORT,(req,res) => {
    console.log("app started")
})