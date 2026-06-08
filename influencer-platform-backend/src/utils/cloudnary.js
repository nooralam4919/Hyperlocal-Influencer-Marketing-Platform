// in this file we will create a function to upload images to cloudinary and return the url of the uploaded image. we will use the cloudinary library to upload images to cloudinary. we will also create a function to delete images from cloudinary.


// i want to upload videos and images form server to cloudinary and get the url of the uploaded video or image and store it in the database. i will use the cloudinary library to upload videos and images to cloudinary. i will also create a function to delete videos and images from cloudinary.

import {v2 as cloudinary} from "cloudinary"; 
import fs from "fs";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadToCloudinary = async (localFilePath) => { // (localFilePath) is the path of the file that we want to upload to cloudinary. it can be an image or a video which is stored in the server. we will get this path from the request body when the user uploads a file to the server. we will use this path to upload the file to cloudinary and get the url of the uploaded file.

    try{
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // this will automatically detect the type of the file and upload it accordingly. it can be image, video or raw file.
        })
        console.log("File uploaded to Cloudinary successfully", response.url);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath); // this will delete the file from the server after uploading it to cloudinary. we are using fs module to delete the file from the server. we are using unlinkSync method to delete the file synchronously. we are doing this because we want to delete the file from the server immediately after uploading it to cloudinary.
        return null
    }
}

export default uploadToCloudinary