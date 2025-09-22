import mongoose from "mongoose";

const qualificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    institute: { type: String },
   user_id:{
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
       },
  },
  { timestamps: true }
);

export default mongoose.model("qualification", qualificationSchema);
