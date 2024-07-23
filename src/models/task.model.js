import mongoose,{Schema} from 'mongoose'
const taskSchema = new Schema(
{
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true 
},
dateAdded:{
    type:Date,
    // required:true
},
dateOfComplition:{
    type:Date,
}
},{timestamps:true})


export const Task = mongoose.model("Task",taskSchema);

