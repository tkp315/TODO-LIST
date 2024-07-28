import mongoose from 'mongoose'
import {Schema} from 'mongoose'

const categorySchema = new Schema(
{
  name:{
    type:String,
    required:true
  },


  
  tasks:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }
  ]

}
,{timestamps:true})

export const Category = mongoose.model("Category",categorySchema);