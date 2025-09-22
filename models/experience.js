import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String },
    years: { type: String },
  
   user_id:{
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
       },
  },
  { timestamps: true }
);

export default mongoose.model("experience", experienceSchema);
