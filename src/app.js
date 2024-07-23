import express from 'express'
import cors from'cors'
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true 
}))

app.use(cookieParser())

app.use(express.static('/public'))

app.use(express.json({
    limit:"20KB"
}))

app.use(express.urlencoded({extended:true}))
export {app}