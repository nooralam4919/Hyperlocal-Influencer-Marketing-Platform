import mongoose from "mongoose";
import BD_NAME from "../constants.js";
import dns from "dns";

// Force Node.js to use Cloudflare DNS
dns.setServers(["1.1.1.1", "1.0.0.1"]); // this line is used to set the DNS servers that the application will use for resolving domain names. In this case, it is setting the DNS servers to Cloudflare's public DNS servers (1.1.1.1 and 1.0.0.1)



const connectionDB = async () =>{
    try{
        console.log("URI:", process.env.MONGODB_URI);
        console.log("DB:", BD_NAME);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${BD_NAME}`);
        console.log(`\n MongoDB connected !! : ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("there is an issue", error);
        process.exit(1);
    }
} 

export default connectionDB

// (-r dotenv/config --experimental-json-modules) is used to load environment variables from the .env file before running the application, and it also enables support for JSON modules in Node.js.