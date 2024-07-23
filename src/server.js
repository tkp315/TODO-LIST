import { app } from "./app.js";
import dotenv from 'dotenv'
import { connectToDB } from "./database/db.js";
import { DB_NAME } from "./constants.js";

dotenv.config({path:'./.env'})

const port = process.env.PORT

connectToDB().then(()=>{
    console.log("!! Mongo DB connected at :",DB_NAME)
}).catch(()=>{
    console.log("Problem occurs while connecting to DB")
})

app.listen(port, (req,res)=>{
console.log(`Server is listening at port : ${port}`)
})
