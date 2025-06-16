// require ('dotenv').config({path:'./env'}) 
// uper vli line se code chal jayega pr ek better aporoch hai below

import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})






connectDB()

















/*
import mongoose from "mongoose"
import { DB_NAME } from "./constants";

import express from "express"
const app = express()

// function connectDB(){}


// connectDB()

// uper vale function se better hai effe uske phle semicollen use krte hai for reducing erorr(cleaning purpuse)

;(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("ERROR")
        throw error
       })
    app.listen(process.env.PORT,() =>{
       console.log(`App is listing on port ${process.env.PORT}`) 
       } )

    } catch (error) {
        console.log("ERROR",error);
        throw err
        
    }
})() */