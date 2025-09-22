import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';
import Job from '../models/jobModel.js';

export const adminReview= async(req,res)=>{
    const {jobId}= req.params;
    const{ ratings, comment} = req.body;
    try{
        const job = await Job.findById(jobId).populate('assignedFreelancer');
        if(!job){
            return res.status(404).json({ message: "Job not found" });
        }
        if(job.status !== 'completed'){
            return res.status(400).json({ message: "Job is not completed yet" });
        }
        const existingReview = await Review.findOne({
            reviewer: req.user._id,
            recipient: job.assignedFreelancer._id,
            job: job._id
        });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this freelancer for this job" });
        }

        const review = await Review.create({
            reviewer: req.user._id,
            recipient: job.assignedFreelancer._id,
            job: job._id,
            ratings,
            comment
        });
        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const freelancerReview = async(req,res)=>{
    const {jobId}= req.params;
    const{ ratings, comment } = req.body;
    try{
         const job = await Job.findById(jobId).populate('poster');
        if(!job){
            return res.status(404).json({ message: "Job not found" });  

    }
        if(job.status !== 'completed'){
            return res.status(400).json({ message: "Job is not completed yet" });
        }
        const existingReview = await Review.findOne({
            reviewer: req.user._id,
            recipient: job.poster._id,
            job: job._id
        });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this client for this job" });
        }

        const review = await Review.create({
            reviewer: req.user._id,
            recipient: job.poster._id,
            job: job._id,
            ratings,
            comment
        });
        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const getUserReviews = async (req, res) => {
    const { userId } = req.params;
    try {
        const reviews = await Review.find({ recipient: userId })
            .populate('reviewer', 'name')
            

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this user" });
        }

        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((acc, review) => acc + review.ratings, 0) / totalReviews.toFixed(1);

        res.status(200).json({ message: "Reviews fetched successfully", reviews, totalReviews, averageRating });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

      