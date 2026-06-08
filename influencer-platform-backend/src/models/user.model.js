import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema  = new Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    email:{
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        lowercase: true,
    },
    avatar:{
        type: String,
        required: [true, "avatar is required"],
    },
    fullname:{
        type: String,
        required: [true, "fullname is required"],
        trim: true,
        lowercase: true,
    },
    watchHistory:[
    {
        type: Schema.Types.ObjectId,
        ref: "Video",
    }],
    coverImage:{
        type: String, // optional field
    },
    password:{
        type: String,
        required: [true, "password is required"],
    },
    refreshToken:{
        type: String,
    },


}, {timestamps: true})

//In Mongoose, pre() is a middleware (hook) that runs before a specific event happens. In this case, we are using pre('save') to run a function before saving a user document to the database. This is useful for performing actions like hashing the password before it gets stored in the database. The function takes a next parameter, which is a callback that you call when you're done with your operations, allowing the save process to continue.
userSchema.pre('save', async function(next){  // this function will run before saving the user to the database. it is used to hash the password before saving it to the database. we are using bcrypt library to hash the password.
    if(!this.isModified('password')) return next(); 
    this.password = await bcrypt.hash(this.password, 10)
    next();
})


userSchema.methods.isPasswordCorrect = async function(password) { // Mongoose allows us to attach functions to every userSchema document.
    return await bcrypt.compare(
        password, // sended password by user in login request
        this.password // hashed password stored in the database
    );
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(  // sign method is used to generate a token. it takes three arguments, first is the payload, second is the secret key and third is the options.,,, The sign() function creates a JWT.
       {
            _id:  this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        }, // 1
        process.env.ACCESS_TOKEN_SECRET, // 2
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        } // 3
        // The sign() function creates a JWT. It takes three arguments:
        // 1. Payload: This is the data that you want to include in the token. It can be any JSON object. In this case, we are including the user's _id, email, username, and fullname in the payload.
        // 2. Secret Key: This is a string that is used to sign the token. It should be kept secret and should not be shared with anyone. In this case, we are using an environment variable called ACCESS_TOKEN_SECRET as the secret key.
        // 3. Options: This is an optional object that can contain various options for the token. In this case, we are setting the expiresIn option to specify how long the token should be valid. We are using an environment variable called ACCESS_TOKEN_EXPIRES_IN to set the expiration time for the token.
        // hree arguments:
        // 1. Payload
        // 2. Secret Key
        // 3. Options
    )
}

userSchema.methods.generateRefreshToken = function() {
     return jwt.sign(  // sign method is used to generate a token. it takes three arguments, first is the payload, second is the secret key and third is the options.,,, The sign() function creates a JWT.
       {
            _id:  this._id,
        }, // 1
        process.env.ACCESS_REFRESH_TOKEN_SECRET, // 2
        {
            expiresIn: process.env.ACCESS_REFRESH_TOKEN_EXPIRES_IN
        } // 3 
        // hree arguments:
        // 1. Payload
        // 2. Secret Key
        // 3. Options
    )
}

const User = mongoose.model("User", userSchema);
export default User;