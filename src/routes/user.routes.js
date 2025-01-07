import { Router } from "express";
import { loginUser, LogoutUser, registerUser } from "../controllers/user.controller.js";
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

export default router