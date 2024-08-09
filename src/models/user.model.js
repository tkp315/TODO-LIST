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
        ],
          isFinished:{
            type:Boolean
          },
          category:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
          }]
    },
    {timestamps:true})


    userSchema.pre("save", async function(next) {
        if (!this.isModified("password")) return next();
    
        const encryptedPassword = await bcrypt.hash(this.password, 10);
        this.password = encryptedPassword; // Assign the hashed password back to the user object
        next();
    });
    


    userSchema.methods.generateAccessToken=function(){
        return jwt.sign(
            {
                name:this.name,
                _id:this._id, 
                email:this.email
            },
            
           process.env.ACCESS_TOKEN_SECRET,
           {
            expiresIn:`${process.env.ACCESS_TOKEN_EXPIRY}d`
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
            
           process.env.REFRESH_TOKEN_SECRET,
           {
           expiresIn:`${process.env.REFRESH_TOKEN_EXPIRY}d`
           }        
        )
    }
    

 

    
export const User = mongoose.model("User",userSchema);