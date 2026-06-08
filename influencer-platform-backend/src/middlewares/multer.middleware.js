
// What is Multer?

// Multer is a middleware for Node.js + Express that handles file uploads.

// When a user uploads a file (image, PDF, video, etc.) from a form, Multer processes the incoming file and makes it available in your Express route.
// Multer can save the uploaded file to a specified directory on your server or keep it in memory for further processing (like uploading to a cloud service). It also provides options for file filtering, size limits, and more.

// In this file, we will create a Multer middleware to handle file uploads in our Express application. We will configure Multer to store uploaded files in a specific directory and set limits on the file size and type.


import multer from 'multer';
import {v2 as cloudinary} from "cloudinary";





const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/temp') // this will save the uploaded files in the uploads folder in the root directory of the project. you can change this to any directory you want.

        //  1. req
        // The Express request object.
        // destination: function(req, file, cb){
        // This contains everything sent by the client in json data

        // 2. file
        // Information about the uploaded file.
        // Example:
        // console.log(file);
        // might output:

        // 2 (cb) stands for callback.
        // Multer pauses and waits for you to tell it:
        // Whether an error occurred.
        // Which folder to save the file in.

        //  cb(null, "uploads/")
        // Error = null (no error)
        // Destination = uploads/
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})


export const upload = multer({
    storage:storage
})