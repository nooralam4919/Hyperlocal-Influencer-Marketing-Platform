// this file laod first


// require("dotenv").config({path: "./.env"}); // this line is used to load environment variables from the .env file into process.env, allowing you to access them in your application.

// 2nd way to to use dotenv

import dotenv from "dotenv";
import connectionDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path:'./.env'
})

// dotenv.config({path: "./.env"}); // this line is used to load environment variables from the .env file into process.env, allowing you to access them in your application.

//(// (***********dotenv.config({path: "./.env"});(***********) this cann't be used in unless change in the scripts in jason file to "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js" because it will load the environment variables before running the application, and it also enables support for JSON modules in Node.js.
// (-r dotenv/config --experimental-json-modules) is used to load environment variables from the .env file before running the application, and it also enables support for JSON modules in Node.js.)

connectionDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, () => {
    console.log(`server is running on port no: ${process.env.PORT}`)
    })
    app.on('error', (error) =>{
       console.log("error in running the server");
       throw error;
    })

})
.catch((error)=>{
    console.log("connection failed", error);
})


// import express from "express";
// const app = express();
// // async IIFE
// (async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${BD_NAME}`);
//        console.log("connected to database");
//        app.on("error", (error) =>{
//         console.log("error in running the server");
//         throw error;
//        })
//        // (on) is listener when the server is running and listening to the port
//        app.listen(process.env.PORT, () => {
//         console.log(`server is running on port ${process.env.PORT}`);
//        })
//     }catch(erro){
//         console.log(erro)
//     }
// })()


// // What is process in Node.js?

// // process is a global object provided by Node.js that contains information about the currently running Node.js application and its environment. It provides various properties and methods that allow you to interact with the runtime environment, such as accessing environment variables, handling command-line arguments, and managing the application's lifecycle.

// // In the code snippet you provided, process.env is used to access environment variables. Specifically, process.env.MONGODB_URI is used to retrieve the value of the MONGODB_URI environment variable, which is expected to contain the connection string for the MongoDB database. This allows you to keep sensitive information like database credentials out of your source code and instead manage them through environment variables.