import clientProfile from "../models/clientProfile.js";
import User from '../models/userModel.js';

export const createOrUpdateProfile = async (req, res) => {
  try {
    const { name, industry, website, location, description } = req.body;

    if (!name || !industry || !location) {
      return res.status(400).json({ message: "Name, Industry, and Location are required" });
    }


    let profile = await clientProfile.findOne({ user_id: req.user._id });

    if (profile) {
     
      profile.name = name;
      profile.industry = industry;
      profile.website = website;
      profile.location = location;
      profile.description = description;

      await profile.save();

      return res.status(200).json({ message: "Profile updated successfully", profile });
    }

 
    profile = await clientProfile.create({
      user_id: req.user._id,
      name,
      industry,
      website,
      location,
      description,
    });

    return res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error("❌ Error in createOrUpdateProfile:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getMyProfile = async (req, res) => {
  try {
    const profile = await clientProfile.findOne({ user_id: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Create Profile" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Error in getMyProfile:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    await clientProfile.findOneAndDelete({ user_id: req.user._id });

    return res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteProfile:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
