 import express from "express"
 import cors from 'cors'
 import cookieParser from "cookie-parser";

 const app = express();

//  app.use() tells Express:
// "Run this middleware for every request that comes to the server."

 app.use(cors({
    origin:process.env.CORS_ORIGIN ,
    credentials: true
 }))



//  app.get(process.env.PORT, (req, res) =>{  // In Express.js, app.get() creates a route handler for HTTP GET requests.
//     console.log("Hello, World!")
//  })

 app.use(express.json({limit: '15kb'})) // this line is used to parse incoming JSON requests with a body size limit of 15 kilobytes. It ensures that the server can handle JSON payloads while preventing excessively large requests that could potentially lead to performance issues or security vulnerabilities..

 app.use(express.urlencoded({extended: true, limit: '15kb'})) // this line is used to parse incoming requests with URL-encoded payloads. It allows the server to handle form data and other URL-encoded data sent in the request body. The extended: true option enables parsing of nested objects, which can be useful for handling complex data structures.
 
 app.use(express.static('public'))  // this line is used to serve static files from the specified directory. It allows you to serve files such as images, CSS, JavaScript, and other assets directly from the server without needing to define specific routes for each file. You can specify the directory where your static files are located, and Express will handle the routing for those files automatically.

 app.use(cookieParser()) // this line is used to parse cookies in incoming requests. It allows you to access and manipulate cookies sent by the client in your Express application. By using cookieParser, you can easily read and set cookies, which can be useful for managing user sessions, authentication, and other stateful interactions in your application.


 // (middleware) is a entity present in frontend and backend for example checking the user is authenticated or not before allowing access to certain routes, logging requests, handling errors, and more. It acts as a bridge between the incoming request and the final route handler, allowing you to perform various operations on the request and response objects before they reach their intended destination.


 // routes import 

 import userRouter from './routes/user.routes.js'

 // route declaration

//  app.get('/') // without (router file)

// app.use('/user', userRouter)
app.use('/api/v1/users', userRouter)

// it is like 
// http://localhost:8000/user/register (by userRouter)
// http://localhost:8000/api/vi/register (by userRouter) -> using API router


 export { app }