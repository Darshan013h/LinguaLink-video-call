import { json, Router } from "express";
import { login, logout, signup,onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login)
router.route("/logout").post(logout)

router.route("/onboarding").post(protectRoute,onboard)
//before calling onBoard method just make sure u go to protectRoute and check if this route is protected

//chcks if user is logged in or not
router.route("/me").get(protectRoute,(req,res)=>{
    res.status(200).json({success:true, user:req.user})
})

export default router;