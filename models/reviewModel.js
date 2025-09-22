import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
    reviewer:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    ratings:{
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment:{
        type:String,
        default:""
    }
},{ timestamps: true });

const ReviewModel = mongoose.model('Review', reviewSchema);

export default ReviewModel;