import Portfolio from "../models/Portfolio.js";
import path from "path";
import fs from "fs";


export const createOrUpdatePortfolio = async (req, res) => {
  try {
    console.log(req.body);
    const {
      title,
      description,
      tags,
      skills,
      tools,
      industry,
      projectUrl,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }


    let imageUrl = "";
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    let portfolioItem;

    portfolioItem = await Portfolio.create({
     user_id: req.user._id,
      title,
      description,
      tags,
      skills,
      tools,
      industry,
      projectUrl,
      imageUrl,
    });

    return res.status(201).json({ message: "Portfolio created successfully", portfolioItem });
  } catch (error) {
    console.error("❌ Error in createOrUpdatePortfolio:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all portfolio items
export const getAllPortfolio = async (req, res) => {
  try {
    const userId= req.user._id;
    const portfolioItems = await Portfolio.find({user_id:userId}).sort({ createdAt: -1 });
    return res.status(200).json(portfolioItems);
  } catch (error) {
    console.error("❌ Error in getAllPortfolio:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolioItem = await Portfolio.findById({_id:id});
    if (!portfolioItem) return res.status(404).json({ message: "Portfolio item not found" });

    // Delete image from server
    if (portfolioItem.imageUrl) {
      const filePath = path.join(process.cwd(), "public", portfolioItem.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Portfolio.findByIdAndDelete({_id:id});
    return res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deletePortfolio:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
