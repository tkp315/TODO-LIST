import { User } from "../models/user.model.js";
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import ApiError from "../utilities/apiError.js";
import { ApiResponse } from "../utilities/apiResponse.js";
import asyncHandlerFunction from "../utilities/asyncHandler.js"
import { uploadOnCloudinary } from "../utilities/cloudinary.js";
import { Category } from "../models/category.model.js";

const signup=asyncHandlerFunction(async(req,res)=>{

    const {name,email, password, confirmPassword}=req.body;
    console.log(req.file)

    if([name,email, password, confirmPassword,].some((e)=>e==="")){
        throw new ApiError(401,"Enter all the fields");
    }

    const alreadyUser = await User.findOne({email});
    if(alreadyUser){
        throw new ApiError(401,"User is already registered,Please login");
    }

    console.log(password ," ", confirmPassword)


    if (password && confirmPassword) {
        if (password !== confirmPassword) {
          throw new ApiError(400, "Password not matched here");
        } 
      }

    const avatarLocalPath = req.file?.path;

    const avatarOnCloudinary = await uploadOnCloudinary(avatarLocalPath,process.env.TODO_LIST);

    const user = await User.create({
        name,
        email,
        password,
        avatar:avatarOnCloudinary?avatarOnCloudinary.secure_url:"",
    })

    return res
    .status(200)
    .json(new ApiResponse(200,{user},"user is created"));

})
const login=asyncHandlerFunction(async(req,res)=>{
    const {email, password}= req.body;

    if([email,password].some((e)=>e=="")){
        throw new ApiError(401,"email or password is missing")
    }
   
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(401,"user is not registered");
    }
    const checkPassword = bcrypt.compare(password,user.password);

    if(!checkPassword){
        throw new ApiError(401,"password is incorrect");
    }
    const userInDB = await User.findById(user._id).select("-password -refreshToken");
    if(!userInDB){
        throw new ApiError(401,"user is not found");
    }

    const accessToken = await user.generateAccessToken(userInDB._id);
    const refreshToken = await user.generateRefreshToken(userInDB._id);



    const options={
         secure:process.env.NODE_ENV==='production',
    sameSite:'none',
    httpOnly:true
    }
    const option1= {
        httpOnly:true,
        // secure:true
       }
    return res
          .status(200)
          .cookie("accessToken",accessToken,options)
          .cookie("refreshToken",refreshToken,options)
          .json(new ApiResponse(200,{userInDB,accessToken,refreshToken},"user is logged in "));

})
const logout=asyncHandlerFunction(async(req,res)=>{

    const user = await User.findById(req.user._id);

    const options = {
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
    sameSite:'none'
    }
   const option1= {
    httpOnly:true,
    // secure:true
   }
    user.updateOne({
        $set:{
            refreshToken:undefined
        }
    })

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"user logged out succssefully"))

})

const taskList = asyncHandlerFunction(async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            throw new ApiError(401, "User is not found");
        }

        // Find the user and populate task lists
        const user = await User.findById(userId)
            .populate("onGoingTask")
            .populate("listOfCompleted")
            .exec();

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Prepare the lists
        const onGoingTaskList = user.onGoingTask;
        const completedTasks = user.listOfCompleted;

        return res.status(200).json(new ApiResponse(200, { onGoingTaskList, completedTasks }, "Fetched all the lists"));
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
});

const folderTasks= asyncHandlerFunction(async(req,res)=>{
    const uid= req.user._id
    const {folderId}=req.body
    const fid = new mongoose.Types.ObjectId(folderId);

    const findFolder = await Category.findById(fid).populate("tasks");
    if(!findFolder){
        throw new ApiError(401,"folder not found");
    }


       
    return res.status(200)
.json(new ApiResponse(200,{findFolder},"Getting all the tasks"))
})
const allFolders=asyncHandlerFunction(async(req,res)=>{
    const uid = req.user._id;

    const category = await User.findById(uid).populate("category");

    return res.status(200).json(new ApiResponse(200,{category},"all folders"))
})



export{signup,login, logout,taskList,folderTasks,allFolders}