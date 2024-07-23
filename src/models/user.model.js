import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        confirmPassword:{
            type:String,
            // required:true
        },
        avatar:{
            type:String,
            // required:true
        },
        refreshToken:{
            type:String
        },
        listOfCompleted:[
           {
             type:mongoose.Schema.Types.ObjectId,
            ref:"Task"
           }
        ],
        onGoingTask:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Task" 
            }
        ]

    },
    {timestamps:true})


    userSchema.pre("save",async function(next){
        if(!(this.isModified("password")))return next();

        const encryptedPassword = await bcrypt.hash(this.password,10);
        next();
    })


    userSchema.methods.generateAccessToken=function(){
        return jwt.sign(
            {
                name:this.name,
                _id:this._id, 
                email:this.email
            },
            
           process.env.ACCESS_TOKEN_SECRET,
           {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
           }        
        )
    }
    userSchema.methods.generateRefreshToken=function(){
        return    jwt.sign(
            {
                name:this.name,
                _id:this._id, 
                email:this.email
            },
            
           process.env.ACCESS_TOKEN_SECRET,
           {
           expiresIn:process.env.Refresh_TOKEN_EXPIRY
           }        
        )
    }
    

 

    
export const User = mongoose.model("User",userSchema);