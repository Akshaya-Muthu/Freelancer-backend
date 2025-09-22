import freelancerProfile from "../models/freelancerProfile.js";
import qualification from "../models/qualification.js";
import education from "../models/education.js";
import experience from "../models/experience.js";
import User from '../models/userModel.js';
import Portfolio from "../models/Portfolio.js";
import Review from '../models/reviewModel.js';

export const createOrUpdateProfile = async (req, res) => {
  try {
    const { title, hourly, location, headline, skills,summary } = req.body;
    console.log(title)
    console.log(hourly)

    if (!title || !hourly || !location) {
      return res.status(400).json({ message: "Title, hourly, and location are required" });
    }
    let rating=0;


    let profile = await freelancerProfile.findOne({ user_id: req.user._id });

    if (profile) {
     
      profile.title = title;
      profile.hourly = hourly;
      profile.headline = headline;
      profile.location = location;
      profile.skills = skills;
       profile.summary = summary;
      
       
      await profile.save();

      return res.status(200).json({ message: "Profile updated successfully", profile });
    }

    profile = await freelancerProfile.create({
      user_id: req.user._id,
      title,
      hourly,
      location,
      headline,
      skills,
      summary,
     rating
    });

    return res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error("❌ Error in createOrUpdateProfile:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getAllFreelancers = async (req, res) => {
  try {
    // Find all users with role 'freelancer'
    const freelancers = await User.find({ role: "freelancer" }).select(
      "name skills location rating hourly title"
    );

    // If no freelancers
    if (!freelancers || freelancers.length === 0) {
      return res.status(404).json({ message: "No freelancers found" });
    }

    // Fetch portfolios for each freelancer
    const result = await Promise.all(
      freelancers.map(async (user) => {
        const portfolio = await Portfolio.find({ user_id: user._id }).select(
          "title description imageUrl"
        );

        const profile= await freelancerProfile.findOne({ user_id: user._id }).select(
          "rating hourly location skills"
        );
         const reviews = await Review.find({ recipient: user._id })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });


    const formattedReviews = reviews.map((r) => ({
      client: r.reviewer.name,
      comment: r.comment,
      rating: r.ratings,
    }));


    const totalRatings = reviews.reduce((sum, r) => sum + r.ratings, 0);
    const averageRating =
      reviews.length > 0 ? (totalRatings / reviews.length).toFixed(2) : 0;

        return {
          id: user._id,
          name: user.name,
          skills: profile.skills,
          location: profile.location,
          rating: averageRating,
          hourlyRate: profile.hourly,
          portfolio: portfolio.map((p) => ({
            title: p.title,
            image: p.imageUrl,
            description: p.description,
          })),
       
       
          reviews:formattedReviews,
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching freelancers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const createEducation = async (req, res) => {
  try {
    const { degree, school, years } = req.body;


    if (!degree || !school || !years) {
      return res.status(400).json({ message: "Degree, School, Years are required" });
    }

    let profile = await education.findOne({ user_id: req.user._id });
    profile = await education.create({
      user_id: req.user._id,
      degree,
      school,
      years
    });

    return res.status(201).json({ message: "Education details created successfully", profile });
  } catch (error) {
    console.error("❌ Error in createEducation:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const createQualification = async (req, res) => {
  try {
    const { name, institute } = req.body;


    if (!name || !institute ) {
      return res.status(400).json({ message: "name, institute" });
    }
    let profile = await qualification.findOne({ user_id: req.user._id });
    profile = await qualification.create({
      user_id: req.user._id,
      name,
      institute
    });

    return res.status(201).json({ message: "Qualification details created successfully", profile });
  } catch (error) {
    console.error("❌ Error in createQualification:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const createExperience = async (req, res) => {
  try {
    const { role, company,years } = req.body;


    if (!company || !years ) {
      return res.status(400).json({ message: "years, company" });
    }
    let profile = await experience.findOne({ user_id: req.user._id });
    profile = await experience.create({
      user_id: req.user._id,
      role,
      company,
      years
    });

    return res.status(201).json({ message: "Qualification details created successfully", profile });
  } catch (error) {
    console.error("❌ Error in createQualification:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



export const getExperience = async (req, res)=>{
    const userId= req.user._id;
    try{
        const pro = await experience.find({user_id:userId}).sort({createdAt:-1});
        return res.status(200).json({pro});
    }catch(error){
        console.error("Error fetching profile:", error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const getQualification = async (req, res)=>{
    const userId= req.user._id;
    try{
        const pro = await qualification.find({user_id:userId}).sort({createdAt:-1});
        return res.status(200).json({pro});
    }catch(error){
        console.error("Error fetching profile:", error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const getEducation = async (req, res)=>{
    const userId= req.user._id;
    try{
        const pro = await education.find({user_id:userId}).sort({createdAt:-1});
        return res.status(200).json({pro});
    }catch(error){
        console.error("Error fetching profile:", error);
        return res.status(500).json({message: 'Internal server error'});
    }
}



export const getMyProfile = async (req, res) => {
  try {
    const profile = await freelancerProfile.findOne({ user_id: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Error in getMyProfile:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    await freelancerProfile.findOneAndDelete({ user_id: req.user._id });

    return res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteProfile:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
