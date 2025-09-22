import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    role:{
        type:String,
        enum: ['freelancer', 'admin'],
        default: 'freelancer'
    },
    skills:{
        type: [String],
        default: []
    },
    bio:{
        type: String,
        default: ''
    },
    ratings:{
        type: [Number],
        default: []
    }




},{    timestamps: true});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;