import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    user_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    budget:{
        type: Number,
        required: true
    },
    deadline:{
        type: Date,
        required: true
    },
    skills:{
        type: [String],
        required: true
    },
    category: {
      type: String,
      required: true,
    },
    status:{
        type:String,
        enum: ['open', 'in-progress', 'completed', 'cancelled'],
        default: 'open'
    },
    poster:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certificate: {
        type: String,
        default: null
    },
    assignedFreelancer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null
}

},{ timestamps: true });

const JobModel = mongoose.model('Job', jobSchema);
export default JobModel;