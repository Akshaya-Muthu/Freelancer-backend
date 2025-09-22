import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
export const isProtected = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized access, please login first"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();

    }catch(error){
        console.error("Error verifying token:", error);
        return res.status(401).json({message:"Invalid token, please login again"});
    }
}

