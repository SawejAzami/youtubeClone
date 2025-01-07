import { Router } from "express";
import {
  loginUser,
  LogoutUser,
  registerUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.js"
import { veryfyJWT } from "../middleware/auth.js";
const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

// secure route
router.route("/logout").post(veryfyJWT, LogoutUser);
router.route("/refresh-token").post(refreshAccessToken);


export default router