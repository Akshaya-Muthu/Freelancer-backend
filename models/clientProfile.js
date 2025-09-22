import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: { type: String },
    website: { type: String },
    location: { type: String },
    description: { type: String },
   user_id:{
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
       },
  },
  { timestamps: true }
);

export default mongoose.model("ClientProfile", clientProfileSchema);
