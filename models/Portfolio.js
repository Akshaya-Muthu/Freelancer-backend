import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: String },
  skills: { type: String },
  tools: { type: String },
  industry: { type: String },
  projectUrl: { type: String },
  imageUrl: { type: String },
   user_id:{
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
       },

}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);

