import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import{ uploadOnCloudinary } from "../utils/cloudinary.js"

import { ApiResponce } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req ,res)=>{
    // get user details from frontend
    // validtaion - not emapty
    // check if user already exists: username ,email 
    // check for image , check for avatar
    // upload them to coludinary{and url le lenge },avatar
    // craete user object - create entry in db
    // remove password and refresh token field from response
    //check for user creation
    // return res

    const {fullName,email,username,password} = req.body
    console.log("email",email);

    // if(fullName === ""){
    //     throw new ApiError(400,"fullname is required")
    // }

    // uper vala bhi sahi hai beginner fraindly hai 

    // advanced method sabko ek sayh check karne ka 

    if ([fullName, email, username, password].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"All field are Required")
        
    }
    
    const existedUser = await User.findOne({
        //%or: se kayi sare fields ek sath check kr skte hai
        $or:[{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists ")
    }
    console.log(res.files);
    

   const avatarLocalPath = req.files?.avatar[0]?.path;
   // req.files ko console.log krke dekho jo bhi cnsole.log krke dekhna chiahiye for better understandig
   const coverImageLocalPath = req.files?.coverImage[0]?.path;


    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
    
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
     throw new ApiError(400,"Avatar file is required")
   }

   const user =await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()

   })
   const craetedUser = await User.findById(user._id).select(
    // ye do field select ho nhi ayegi
    "-password -refreshToken"
   )
   if(!craetedUser){
    throw new ApiError(500,"somthing went wrong while registering the user")
   }

   return res.status(201).json(
    new ApiResponce(200,craetedUser,"user registered successfully")
   )

})

export {registerUser}