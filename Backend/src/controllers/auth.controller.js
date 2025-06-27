import { asyncHandler } from "../utils/asyuncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";


export const  signup = asyncHandler( async(req,res)=>{
    const {email,password,fullName}= req.body

        if(
            [email,password,fullName].some((field)=>field?.trim() === "")
        ){
            throw new ApiError(400,"All fields are required");
        }

        if(password.length < 6){
            throw new ApiError(400,"Password must be at leat 6 characters");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//41
        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new ApiError(400,"User with email already exists, Please use a different one")
        }

        // const idx = Math.floor(Math.random()*100)+1; //generate number btw 1 and 100
        // const randomAvatar = `https://pixabay.com/vectors/avatar-icon-placeholder-profile-2092113/`

        const randomSeed = Math.random().toString(36).substring(7);
        const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        })

        //TODO: create user in stram as well   (done)
           try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.error(" Error creating Stream user:", error);
        }

            
    
        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        });

        res.cookie("jwt",token,{
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly:true, //prevent XSS attacks
            sameSite: "strict",//prevent CSRF attacks
            secure:process.env.NODE_ENV === "production",
            // secure: false
        })

        return res.status(201).json(
        new ApiResponse(200,newUser,"User Registered Successfully")
        )

})

export const login = asyncHandler(async (req,res) => {
    const { email,password} = req.body;

    if(
        !email || !password
        // [email,password].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required");
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(401,"Invalid Email or Password")
    }

    const isPasswordCorrect =await user.matchPassword(password)

    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid email or password");
    }

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        });

        res.cookie("jwt",token,{
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly:true, //prevent XSS attacks
            sameSite: "strict",//prevent CSRF attacks
            secure:process.send.NODE_ENV === "production",
        });

        return res
        .status(200)
        .json(
            new ApiResponse(200,user,"User Logged in successfully")
        )
})

export const logout = asyncHandler(async (req,res) => {
    res.clearCookie("jwt")
    res
    .status(200)
    .json(
        new ApiResponse(200,"Loged Out Successfully")
    )
})

export const onboard =  asyncHandler(async (req,res) => {
    // we can now user req.user becuase we are using middleware protectRoute
    // console.log(req.user);

    // try {
        
        const userId = req.user._id;

        const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body
        
        if (
            [fullName, bio, nativeLanguage, learningLanguage, location].some(
                    (field) => typeof field !== "string" || field.trim() === "")
        ) {
            throw new ApiError(400 ,"All fields are required and must be non-empty strings.");
        }
            // return res
            // .status(400)
            // .json({
            //     message:"All Fields are required",
                // missingFields:[
                //    !fullName && "fullName",
                //     !bio && "bio",
                //     !nativeLanguage && "nativeLanguage",
                //     !learningLanguage && "learningLanguage",
                //     !location && "location", 
                // ].filter(Boolean),
            // })

            const updateUser = await User.findByIdAndUpdate(userId,
            {
                ...req.body,
                isOnboarded : true,
            },
            {
                new:true
            }
            )

            if(!updateUser){
                throw new ApiError(404,"User Not Found")
            }

            //TODO : update userInfo in stream
            try {
                await upsertStreamUser({
                    id: updateUser._id.toString(),
                    name: updateUser.fullName,
                    image : updateUser.profilePic || "",
                }) 
                console.log(`Strea user updated after onboarding for ${updateUser.fullName}`);
                
            } catch (streamError) {
                console.log("Error updating stream user during onboarding",streamError.message);
                
            }

            res
            .status(200)
            .json(
                new ApiResponse(200,updateUser,"Onboarding Successfull")
            )
})