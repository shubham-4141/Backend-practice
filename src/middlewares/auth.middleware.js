import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verfiyJWT = asyncHandler( async (req,res/* res ki jagh hm underscore bhi use kr skte hai kyuki ye use me nhi aya hai (_) */,next)=>{
   try {
     const token = req.cookies?.accessToken || req.header
     ("Authorization")?.replace("Bearer ","")
 
     if(!token){
         throw new ApiError(401,"Unauthorized request")
     }
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
    if(!user){
     // NEXT_VIDEO:discuss about frontend in lectur 17 chai aur backend 8:42 min
     throw new ApiError(401,"Invalid Access Token")
    }
 
    req.user = user;
    next()
 
 
   } catch (error) {
    throw new ApiError(401,error?.message ||"Invalid Access Token")
    
   }
})
