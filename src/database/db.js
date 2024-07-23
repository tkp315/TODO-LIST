import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectToDB = async()=>{
    try {
        
      const dbInstance=  await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);

        // console.log(dbInstance);

    } catch (error) {
       console.log("db is not connected",error.response.message) 
    }
}

export {connectToDB}