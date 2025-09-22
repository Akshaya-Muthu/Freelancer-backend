import mongoose from "mongoose";

const freelancerProfileSchema = new mongoose.Schema(
  {

    title: { type: String, required: true }, 
    hourly: { type: Number, required: true }, 
    location: { type: String, required: true }, 
    headline: { type: String, required: true }, 
    skills: { type: [String], required: true }, 
    summary: { type: String, required: true },
    rating:{ type: Number, required: true },

   user_id:{
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
       },
  },
  { timestamps: true }
);

export default mongoose.model("freelancerProfile", freelancerProfileSchema);
