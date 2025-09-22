import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req, res)=>{
    const {name, email, password, role, skills, bio}= req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message: "Please fill all the required fields"});
        }
        const ExistingUser = await User.findOne({email});
        if(ExistingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name, 
            email,
            password: hashedPassword,
            role: role || 'freelancer',
            skills: skills || [],
            bio: bio || ''
            
        });
       await newUser.save();
        res.status(200).json({message: "User registered successfully"});
    } catch(error){
        console.error("Error registering user:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id; 
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req,res)=>{
    const {email, password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message: "Please fill all the required fields"});
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch(error){
        console.error("Error logging in user:", error);
        res.status(500).json({message: "Internal server error"});
    }
};


// export const logoutUser = async (req, res) => {
//     try{
//         res.cookie('token',"",{
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict',
//             maxAge: 0 // Set cookie to expire immediately
//         });
//         res.status(200).json({message: "Logout successful"});
//     } catch(error){
//         console.error("Error logging out user:", error);
//         res.status(500).json({message: "Internal server error"});
//     }}


export const logoutUser = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




