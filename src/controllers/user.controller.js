import router from "../routes/user.routes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js"
import { response } from "express"

const generateAccessAndRefreshToken=async(userId)=>{
  try {
   const user= await User.findById(userId)
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({validateBeforeSave:false})

  return { refreshToken, accessToken };

  } catch (error) {
    throw new ApiError(500,"something wen wrong while generating refresh and access token ")
  }
}

const registerUser=asyncHandler(async (req, res)=>{
    // get details from fronted
    // validation -not empty
    // check user is already exists
    // check for image ,check for avatar
    // upload then to cloudinary
    // create user Object-create entry in db
    // remove password and refress toekn field from response
    // check for user creation
    // return response

       const {fullName,email,userName,password}= req.body
       console.log(userName, password, email,fullName);
        // if(fullName===""){
        //     throw new ApiError(400,"fullname is required")
        // }
        if([fullName,userName,email,password].some((field)=>
        field?.trim()===""
        )){
            throw new ApiError(400,"All field are required")
        }

        const existedUser=await User.findOne({
            $or:[{userName},{email}]
        })
        if(existedUser){
            throw new ApiError(409,"User is already exists")
        }

        const avatarLocalPath= req.files?.avatar[0]?.path;
        const coverImageLocalPath=req.files?.coverImage[0]?.path;

        // let coverImageLocalPath;
        // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        //   coverImageLocalPath=req.files.coverImage[0].path;
        // }

        if(!avatarLocalPath){       
            throw new ApiError(400, " avatarLocalPath is  required");
        }

       const avatar = await uploadOnCloudinary(avatarLocalPath);
       const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        // console.log(avatar);
        if(!avatar){
            throw new ApiError(400, "Avatar is required");
        }

      const user= await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url||"",
            userName:userName.toLowerCase(),
            password,
            email

        })

      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      if(!createdUser){
        throw new ApiError(500,"something went wrong while registration")
      }

      return res.status(201).json(
       new Apiresponse(200,createdUser,"user registered successfully")
      )

})

const loginUser=asyncHandler(async (req,res)=>{
  // req body=> data
  // username or email 
  // find user
  // password check
  // access and refresh token
  // send cookies 

  const {userName,email,password}=req.body
  if(!(userName || email)){
    throw new ApiError(400,"userName or email is required")
  }

 const user=await User.findOne({
    $or:[{userName},{email}]
  })

  if(!user){
    throw new ApiError(404,"user does not exist")
  }

  const ispasswordCorrect=await user.ispasswordCorrect(password)

   if (!ispasswordCorrect) {
     throw new ApiError(401, "password is not correct");
   }

    const {refreshToken,accessToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    const options={
      httpOnly:true,
      secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken, options)
    .json(
      new Apiresponse(
        200,
        {
          user:loggedInUser,accessToken,refreshToken
        },
        "User Logged In Successfully"
      )
    )

})

const LogoutUser=asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(
  req.user._id,
  {
    $set:{
      refreshToken:undefined
    }
  },
    {
      new:true
    }
  
)
const options = {
  httpOnly: true,
  secure: true,
};
 


return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new Apiresponse(200,{},"User Logged out"))


})


export { registerUser, loginUser, LogoutUser };