import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import {user, User} from "../models/user.models.js";
import {uploadFromCloudinary} from "../utils/cloudinary.js"
import apiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
   // get user detail from frontend 
   const {fullName , email,userName , password }= req.body;
   console.log("email is : ",email);

   
   // validation (checking data at backend ) ex- not empty 
   //  if(fullName==="") throw new apiError(400,"fullName is required"); this is begineer way of validation
    if(
        [fullName,email,userName,password].some((field)=>{
            return field?.trim()=="";
        })
    ){
        throw new apiError(400,"all fields are Required");
    }


   //check if already registered : check by username or email as you want , but it must be unique
    const existedUser = User.findOne({
        $or :[{userName},{email}]
    });
    if(existedUser) throw new apiError(409 , "User with email or username already exist");


   // check for images , check for avatar 
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath =req.files?.coverImage[0]?.path;

   if(!avatarLocalPath) throw new   apiError(400,"avatar is required !");

   // if images available upload them to cloudinary
    const avatar = await uploadFromCloudinary(avatarLocalPath);
    const coverImage = await uploadFromCloudinary(coverImageLocalPath);

    if(!avatar) throw new apiError(400,"avatar is requried !");

   // create user object for uploading database at mongoose(crete entry at db)
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url|| "",
        email,
        password,
        userName:userName.toLowerCase()

    });
    // remove password and refresh token field from response 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


   // check for user creation 
    if(!createdUser) throw new apiError(500,"some thing went wrong while registering the user");

   // return res
   return res.status(201).json(new apiResponse(200,createdUser,"user is registered successfully!"));
}
)

export default registerUser;