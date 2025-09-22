import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
    job_id: {
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'Job', 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
    type: String,
    enum: ['todo', 'in-progress', 'done','approved','rejected'],
    default: 'todo',
  },
  assigned_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submitted_file_url: {
    type: String,
    default: '', // This will store Cloudinary upload
  },
  submitted_external_link: {
    type: String,
    default: '', // This will store GitHub/Drive/etc. link
  },
  submission_note: {
    type: String,
    default: '',
  },
  rejection_note:{
    type: String,
    default: '',
  }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);