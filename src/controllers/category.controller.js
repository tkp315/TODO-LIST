import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utilities/apiError.js";
import { ApiResponse } from "../utilities/apiResponse.js";
import asyncHandlerFunction from "../utilities/asyncHandler.js";
import mongoose from 'mongoose'

const addCategory = asyncHandlerFunction(async (req, res) => {
    const userId = req.user._id;
    const uid = new mongoose.Types.ObjectId(userId);
    const { name } = req.body;
  
    if (!name) throw new ApiError(401, "Folder name not found");
  
    // Create the new category
    const newList = await Category.create({
      name: name,
    });
  
    // Find the user by ID
    const user = await User.findById(uid);
    if (!user) {
      throw new ApiError(401, "User not found");
    }
  
    // Populate the categories for the user
    await user.populate("category")
  
    // Check if the category name already exists
    const folderNameExists = user.category.some(folder => folder.name === name);
    if (folderNameExists) {
      throw new ApiError(401, "Folder already exists");
    }
  
    // Add the new category to the user's categories
    await user.updateOne({
      $push: { category: newList._id }
    }, { new: true });
  
    return res.status(200).json(new ApiResponse(200, { newList, user }, "New category created"));
  });
  


export{addCategory}