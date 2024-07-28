import mongoose,{Schema} from 'mongoose'

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    dateAdded: {
      type: Date,
       // If you want a default value
    },
    // dateOfComplition: {
    //   type: Date,
    // },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);


