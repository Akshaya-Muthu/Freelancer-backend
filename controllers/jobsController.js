import Job from '../models/jobModel.js';
import Task from '../models/taskModel.js';
import Bid from '../models/bidModel.js';
import { generatePDF } from '../utils/pdfGenerator.js';
// import { sendEmail } from '../utils/email.js';
import { sendCertificateEmail } from '../utils/email.js';
import cloudinary from '../utils/cloudinary.js';
// Controller for creating a job

export const createJob = async (req, res) => {
    const {title, description,budget,deadline,skills,category}= req.body;
    try{
        if(!title || !description || !budget || !deadline || !skills || !category) {
            return res.status(400).json({message: 'All fields are required'});
        }
        const newJob = Job.create({
            user_id: req.user._id,
            title,
            description,
            budget,
            deadline,
            skills,
            category,
            poster: req.user._id
        })
        return res.status(201).json({message: 'Job created successfully'});
    }catch(error){
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }}

// Controller for getting all jobs
export const getJobs = async (req,res)=>{
    const userId= req.user._id;
    try{
        const jobs = await Job.find({user_id:userId});
        if(!jobs || jobs.length === 0) {
            return res.status(404).json({message: 'No jobs found'});
        }
        return res.status(200).json({message: 'Jobs fetched successfully', jobs});
    }catch(error){
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
}

// update job
export const updateJob = async (req, res) => {
    const {id}=req.params;
const {title, description, budget, deadline, skills, category, status} = req.body;
    try {
        const job = await Job.findOneAndUpdate({_id: id}, {
            user_id: req.user._id,
            title,
            description,
            budget,
            deadline,
            skills,
            category,
            status
        }, {new: true});
        return res.status(200).json({message: 'Job updated successfully', job});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
}


//delete job
export const deleteJob = async(req,res)=>{
    const {id} = req.params;
    try{
        const job = await Job.findOneAndDelete({_id:id})
        return res.status(200).json({message:"Job deleted successfully"})
    }catch(error){
        return res.status(500).json({message:'Internal server error', error: error.message})
    }
}
//open jobs
export const getOpenJobs = async (req,res)=>{
    try{
        const openJob = await Job.find({status:'open'}).populate('poster', 'name');
        if(openJob.length === 0){
            return res.status(404).json({message:"No open jobs found"});
        }
        res.status(200).json(openJob);
    }
    catch(error){
        console.error("Error fetching open jobs:", error);
        res.status(500).json({message: "Internal server error"});
    }
}


//job detail 
export const jobDetails = async (req, res)=>{
    const {id} = req.params;
    try {
        const job = await Job.findById(id)
        if (!job) {
            return res.status(404).json({message: 'Job not found'});
        }
        return res.status(200).json({message: 'Job details fetched successfully', job});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
}


//complete job
export const markJobAsCompleted = async (req, res) => {
    const {jobId} = req.params;
    try{
        const job = await Job.findById(jobId).populate('assignedFreelancer');
        if(!job) {
            return res.status(404).json({message: 'Job not found'});
        }
const incompleteTasks = await Task.find({job_id: jobId, status: {$ne: 'approved'}});
if(incompleteTasks.length > 0) {
            return res.status(400).json({message: 'Cannot mark job as completed. There are incomplete tasks.'});
        }
        job.status = 'completed';
        await job.save();
        
        
        const pdfPath = await generatePDF(job);
        
res.status(200).json({ message: 'Job marked as completed',job });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
        

//total jobs 
export const totaljobs = async (req, res) => {
   const userId= req.user._id;
    try {
    const jobs = await Job.find({user_id:userId});
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInProgressJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "in-progress" })
      .populate("assignedFreelancer", "name email");

    const jobsWithBids = await Promise.all(
      jobs.map(async (job) => {
        const acceptedBid = await Bid.findOne({
          job_id: job._id,
          status: "accepted",
        }).populate("user_id", "name email");

        return {
          ...job.toObject(),
          acceptedBid,
        };
      })
    );

    res.status(200).json({ message: "Jobs fetched successfully", jobs: jobsWithBids });
  } catch (error) {
    console.error("Error fetching in-progress jobs with bids:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const getJobById = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: 'Job not found' });
//     res.status(200).json({
//       status: job.status,
//       certificate: job.certificate || null
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };