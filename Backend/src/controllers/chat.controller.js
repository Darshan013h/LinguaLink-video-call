import { asyncHandler } from "../utils/asyuncHandler.util.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import{ generateStreamToken }from "../lib/stream.js"

export const getStreamToken = asyncHandler(async (req,res) => {
    const token = generateStreamToken(req.user.id);

  res.status(200).json(token);;
})