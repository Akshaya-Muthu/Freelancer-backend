import Bid from '../models/bidModel.js';
import Job from '../models/jobModel.js';
import User from '../models/userModel.js';
import { sendEmail } from '../utils/email.js';
export const submitBid = async (req, res) => {
    const {jobId} = req.params;
    const {bid_amount, timeline, message} = req.body;
    // const user_id = req.user._id;
    try{
        const existingBid = await Bid.findOne({job_id: jobId, user_id: req.user._id});
        if(existingBid) {   
            return res.status(400).json({message: 'You have already submitted a bid for this job'});
        }
        const newBid = await Bid.create({
            job_id: jobId,
            user_id: req.user._id,
            bid_amount,
            timeline,
            message
        });
        return res.status(201).json({message: 'Bid submitted successfully', bid: newBid});
    }catch(error){
        console.error("Error submitting bid:", error);
        return res.status(500).json({message: 'Internal server error'});
    }
}


export const getMyBids = async (req, res)=>{
    const userId= req.user._id;
    try{
        const bids = await Bid.find({user_id:userId}).populate("job_id","title deadline status").sort({createdAt:-1});
        return res.status(200).json({bids});
    }catch(error){
        console.error("Error fetching bids:", error);
        return res.status(500).json({message: 'Internal server error'});
    }
}


export const getBidsByJobId = async (req,res)=>{
    const {jobId} = req.params;
    try{
        const bids = await Bid.find({job_id: jobId}).populate("user_id", "name email").sort({createdAt: -1});
        if(bids.length === 0) {
            return res.status(404).json({message: 'No bids found for this job'});
        }
        return res.status(200).json({bids});
    }catch(error){
        console.error("Error fetching bids:", error);
        return res.status(500).json({message: 'Internal server error'});
    }
}


export const acceptBid = async (req,res)=>{
   const {bidId} =req.params;
   try{
   const bid = await Bid.findById(bidId);
   if(!bid){
    return res.status(404).json({message:"Bid not found"});
   }

   const {job_id, user_id}=bid;

   const job = await Job.findById(job_id);
   if(!job){
    return res.status(404).json({message:"Job not found"});
   }
 if(job.assignedFreelancer){
    return res.status(400).json({message:"Job already has an assigned freelancer"});
 }
 bid.status = "accepted";
 await bid.save();

  await Bid.updateMany(
      { job_id: job_id, _id: { $ne: bidId } },
      { $set: { status: 'rejected' } }
    );

 job.assignedFreelancer = user_id;
 job.status = "in-progress";
    await job.save();
 const assignedUserId = job.assignedFreelancer;

    const freelancer = await User.findById(assignedUserId);
    console.log(freelancer.email);
    //await sendEmail(
        //freelancer.email,
        //"You've been selected for this job",
       // `Hi ${freelancer.name},\n\nYou have been selected for this "${job.title}".\n\nPlease login to your dashboard to get started.\n\n- Freelancing SaaS`
       // );




    

    res.status(200).json({message: "Bid accepted successfully and assigned a freelancer"});
} catch(error){ 
    console.error("Error accepting bid:", error);
    return res.status(500).json({message: 'Internal server error'});
  }
}


export const getJobsWithBids = async (req, res) => {
  try {
    const jobs = await Job.find({}).lean();
    const jobsWithBids = [];

    for (let job of jobs) {
      const bidCount = await Bid.countDocuments({ job_id: job._id });
      if (bidCount > 0) {
        jobsWithBids.push(job);
      }
    }

    if (jobsWithBids.length === 0) {
      return res.status(404).json({ message: "No jobs with bids found" });
    }

    res.status(200).json({ jobs: jobsWithBids });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all bids
export const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find();
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};