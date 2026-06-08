import asyncHandler from '../utils/asyncHandler.js'
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import uploadToCloudinary from "../utils/cloudnary.js"
import ApiResponse from "../utils/ApiResponse.js"

// const registerUser = asyncHandler(async(req, res) =>{
//      res.status(200).json({
//         massgae:'OK'
//     })
// })



/* steps to register user
   1. get user detail from frontEnd
      validation (is emptyName or Passowrd is empty)
      check user is already login : by userName or email
      check user file is like image and avator
      if availble push to cloudnay and take it's refrence
     check is data is present or not on cloudnary

   2. now create user object -> create entry in db -> if user crated it will return all value passed by the user like (email, pasward, name and all) 
   but in response to user remove password and freshtoken field from the response
   -> check usr is creted or not -> if yes return response YES
 */

const registerUser = asyncHandler(async(req, res) =>{
     const {fullname, email, username, password} = req.body
     console.log("email", email)

    //  if(fullname === "")
    //     throw new ApiError(400, "enter fulll name")
    //  if(fullname === "")

    //     throw new ApiError(400, "enter fulll name")
    //  if(fullname === "")

    //     throw new ApiError(400, "enter fulll name")
    //  if(fullname === "")

    //     throw new ApiError(400, "enter fulll name")
    //  if(fullname === "")
    //     throw new ApiError(400, "enter fulll name")

    // or 

    if([fullname, email, username, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "all fields are required");
    }
        // checking user availble or not checking by email usernaem

        const existedUser = await User.findOne({ // first user find in database return it
            $or:[{username}, {email}] // if you want to check multiple value like (email, phone etc) the this is syntax
        })

        if(existedUser)
            throw new ApiError(400,"user with email and username exit")

        // req.body -> but we used multer it will add more field to requeset

        const avatarLocalPath = req.files?.avatar?.[0]?.path // not went to cloudnary still on server
        const coverImgLocalPath = req.files?.coverImage?.[0]?.path // not went to cloudnary still on server

        if(!avatarLocalPath)
        {
            throw new ApiError(400, "Avatar file is required")
        }

        const avatar = await uploadToCloudinary(avatarLocalPath) // uploading file which is on server to cloudnary
        const coverImage = await uploadToCloudinary(coverImgLocalPath) // uploading file which is on server to cloudnary

        if(!avatar)
        {
            throw new ApiError(400, "Avatar upload failed")
        }


        // database Entry

        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            username:username.toLowerCase()
        })

        const createUser = await User.findById(user._id).select(
            "-password -refreshToken" // which one you don't want to send the user remove it;
        ) // when the databse is create there is file is associated with every user we can find it by findById

        if(!createUser)
        {
            throw new ApiError(500, "something wrong while registering the user")
        }


        // if everythings is creted the send to (res) to user (frontEnd)
        return res.status(201).json(
            new ApiResponse(200, createUser, "user register successfully")
        )

})


export default registerUser