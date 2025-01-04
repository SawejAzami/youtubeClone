import router from "../routes/user.routes.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const registerUser=asyncHandler(async (req, res)=>{
    res.status(200).json({
        message:"ok you done well"
    })
})


export {registerUser}