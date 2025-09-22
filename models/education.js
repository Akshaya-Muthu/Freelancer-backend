import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    school: { type: String },
    years: { type: String },
  
   user_id:{
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
       },
  },
  { timestamps: true }
);

export default mongoose.model("education", educationSchema);
