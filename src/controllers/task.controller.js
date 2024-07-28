import { Category } from "../models/category.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utilities/apiError.js";
import { ApiResponse } from "../utilities/apiResponse.js";
import asyncHandlerFunction from "../utilities/asyncHandler.js";
import mongoose from 'mongoose'

const newTask = asyncHandlerFunction(async(req,res)=>{

    const{title,  dateAdded,categoryId}= req.body;
    const userId = req.user._id;
    let cid="";
    if(categoryId){
     cid= new mongoose.Types.ObjectId(categoryId);
    }

    if([title,  dateAdded].some((e)=>e==="")){
        throw new ApiError(401,'please complete all the details');
    }
    
    if(!userId){
        throw new ApiError(401,'user not found');   
    }

    const task = await Task.create({
        title,
        
        dateAdded:new Date (dateAdded),
        category:cid?cid:null
    })
    if(cid){
        const category = await Category.findById(cid);
        const taskList = category.tasks.push(task._id);
    await category.save();
    }
    
    

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
    const {taskId,catId}= req.body;
    const tid = new mongoose.Types.ObjectId(taskId);
    const cid = new mongoose.Types.ObjectId(catId);

    if(!tid){
        throw new ApiError(401,"Task id  is not found");
    }
    const user = await User.findById(userId);

     await Task.findByIdAndUpdate(tid,{
     dateOfComplition:Date.now()
    },{new:true})

 

    const completedTasks = user.listOfCompleted;

    completedTasks.push(tid);

   user.onGoingTask= user.onGoingTask.filter((item)=>!item.equals(tid));
    await user.save();
   
    if(catId){
        const category = await Category.findById(cid);

        category.tasks = category.tasks.filter((item)=>!item._id.equals(tid));
        await category.save();
    }

    return res
    .status(200)
    .json(new ApiResponse (200,{user},"deleted from ongoing and added in completed list"));

})

//isFinished

const editTask = asyncHandlerFunction(async(req,res)=>{
    const userId =req.user._id;
    const {taskId,newTitle}= req.body;
    if(!taskId)throw new ApiError(401,"TaskId is not defined");
    if(!newTitle)throw new ApiError(401,"new Title is not defined");
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
        dateAdded:Date.now()
      
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