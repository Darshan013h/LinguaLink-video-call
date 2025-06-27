import express from "express"
import {protectRoute} from "../middleware/auth.middleware.js"
import {getStreamToken} from '../controllers/chat.controller.js'

const router = express.Router();

//we will have only one endpoint that will generate a stream token for us 
//so this token is different from jwt token and this is needed for stram to be able to authenticate the users
router.route("/token").get(protectRoute, getStreamToken)

export default router;