export const isFreelancer = async (req,res,next)=>{
    if(req.user && req.user.role==='freelancer'){
        next();

    }
    else{
        return res.status(403).json({message:"Access denied, freelancers only"});
    }
}