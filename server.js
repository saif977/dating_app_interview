const express=require("express");
const bodyParser = require("body-parser");
const app=express();

const router=require("./route");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const port=process.env.PORT;


app.use(express.urlencoded({extended:true}));

// middleware to read json data
app.use(express.json());


app.use("/",router);


mongoose.connect(process.env.dbURI).then(res=>{
    console.log("succesfully connected to db")
    app.listen(port||8080,()=>{
        console.log("server started on",port)
    });
})