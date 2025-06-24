import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js"
import{ uploadOnCloudinary } from "../utils/cloudinary.js"

import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefereshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken() // methods me paranthesis hota hai
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ValidateBeforeSave:false})

        return{accessToken,refreshToken}

        
    } catch (error) {
        throw new ApiError(500,"somthing wenr wrong while generating referesh and access token ")

        
    }
}

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
    // console.log(res.file);
    

   const avatarLocalPath = req.files?.avatar[0]?.path;
   // req.files ko console.log krke dekho jo bhi cnsole.log krke dekhna chiahiye for better understandig

   // niche vale code se coverImage hona jaruri hog is liye hm let vala code use krenge to undifiend ki error nhi ayegi

//    const coverImageLocalPath = req.files?.coverImage[0]?.path;


    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

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
    new ApiResponse(200,craetedUser,"user registered successfully")
   )

})

const loginUser = asyncHandler(async(req,res)=>{
    // req body se dta lana
    // username or email
    // find the user
    // passward check
    // generate access/refresh token send to user
    // send cookie for tokens
    //print response message

    const{email,username,password} = req.body // data lena hai

    if(!(username || email)){
        throw new ApiError(400,"username or password is required")
    }
    
    const user = await User.findOne({
        $or:[{username},{email}] // ye value find krega ya username ya email
    })

    if(!user){
        throw new ApiError(404,"user doesn't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404,"passwora does not match")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefereshToken(user._id)
    

    const logggedInUser = await User.findById(user._id).select("-password -refreshToken") // ye optional hai pr kyu hai ye samjhna hai(kyuki ek database call badh jati hai)

    const options = {
        httpOnly:true, // ye done operation se hm cookie server side hi modify hongi front end pr nhi modify hogi
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiError(
            200,{
                user:logggedInUser,accessToken,refreshToken // yaha khud user access token aur refresh token ko save kr rha hai
            },
            "User logged in Successfully"
        )
    )
   
})

const logoutUser = asyncHandler(async(req,res)=>{
    // logout kaise kare
    // clear cookies 
    // clear accesstoken and refresh token
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{  /*monogodb oprater*/               refreshToken:undefined
            }
        },
        {
            new:true
        },
        
    
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized Request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
       const user = await User.findById(decodedToken?._id)
    
       if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired or used")
       }
    
       const options = {
        httpOnly:true,
        secure:true
       }
    
        const {accessToken,newrefreshToken} = await generateAccessAndRefereshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new  ApiResponse(
                200,{accessToken,newrefreshToken},
                "Access token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message ||"invalid refresh Token")
        
    }

})

export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}