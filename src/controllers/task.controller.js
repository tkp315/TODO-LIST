import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utilities/apiError.js";
import { ApiResponse } from "../utilities/apiResponse.js";
import asyncHandlerFunction from "../utilities/asyncHandler.js";
import mongoose from 'mongoose'

const newTask = asyncHandlerFunction(async(req,res)=>{

    const{title, description, dateAdded}= req.body;
    const userId = req.user._id;
    if([title, description, dateAdded].some((e)=>e==="")){
        throw new ApiError(401,'please complete all the details');
    }
    
    if(!userId){
        throw new ApiError(401,'user not found');   
    }

    const task = await Task.create({
        title,
        description,
        dateAdded:new Date ()
        
    })

    const addTaskInUser = await User.findByIdAndUpdate(userId,{
        $push:{
            onGoingTask:task._id
        }
    },{new:true})

    return res
    .status(200)
    .json(new ApiResponse(200,{addTaskInUser},"new Task is added"))
})

const isFinished = asyncHandlerFunction(async(req,res)=>{
    const userId =req.user._id;
    const {taskId,dateOfComplition}= req.body;
    const tid = new mongoose.Types.ObjectId(taskId);
    if(!tid){
        throw new ApiError(401,"Task id  is not found");
    }
    const user = await User.findById(userId);

     await Task.findByIdAndUpdate(tid,{
     dateOfComplition:new Date()
    },{new:true})

 

    const completedTasks = user.listOfCompleted;

    completedTasks.push(tid);

   user.onGoingTask= user.onGoingTask.filter((item)=>!item.equals(tid));
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse (200,{user},"deleted from ongoing and added in completed list"));

})

//isFinished

const editTask = asyncHandlerFunction(async(req,res)=>{
    const userId =req.user._id;
    const {taskId,newTitle, newDescription}= req.body;
    const tid = new mongoose.Types.ObjectId(taskId);
    if(!tid){
        throw new ApiError(401,"Task id  is not found");
    }
    const task = await Task.findById(tid)

    if(!task){
        throw new ApiError(401,"Task is not found");
    }
    
    const updateTask = await task.updateOne({
        title:newTitle,
        description:newDescription
    })

    return res
    .status(200)
    .json(new ApiResponse(200,{updateTask},"task is edited"))
})


const removeTask = asyncHandlerFunction(async(req,res)=>{
    const userId =req.user._id;
    const {taskId}= req.body;
    const tid = new mongoose.Types.ObjectId(taskId);
    if(!tid){
        throw new ApiError(401,"Task id  is not found");
    }
    const task = await Task.findById(tid)

    
    const user = await User.findById(userId);

    user.onGoingTask = user.onGoingTask.filter((t)=>!t.equals(tid));
    await user.save();

    await Task.findByIdAndDelete(tid);

    return res
    .status(200)
    .json(new ApiResponse(200,{user},"task is deleted"));
})
// edit
// remove

export {newTask,editTask,removeTask,isFinished}