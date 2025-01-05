import router from "../routes/user.routes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { response } from "express"

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

        const existedUser=User.findOne({
            $or:[{userName},{email}]
        })
        if(existedUser){
            throw new ApiError(409,"User is already exists")
        }

        const avatarLocalPath= req.files?.avatar[0]?.path;
        const coverImageLocalPath=req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar is required")
        }

       const avatar= await uploadOnCloudinary(avatarLocalPath)
       const coverImage= await uploadOnCloudinary(coverImageLocalPath)

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


export {registerUser}