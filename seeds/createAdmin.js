// createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import connectDB from '../config/db.js';
dotenv.config();

connectDB();

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("adminpass", 10);

  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
