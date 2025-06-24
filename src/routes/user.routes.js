import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import {verfiyJWT}  from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:5
            
        },
        {
            name:"coverImage",
            maxCount:1
        
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(verfiyJWT/*refrerance hai */,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router