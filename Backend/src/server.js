import dotenv from 'dotenv';
 dotenv.config();

import express from 'express';

import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import path from "path"
import { ApiError } from './utils/ApiError.js';



const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,//says allow frontend to send cookies
}))

app.use(express.json());

app.use(cookieParser());// now we can use req.cookie.jwt in auth.middleware.js


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../Frontend/dist")))

  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../Frontend/dist/index.html"))
  })
}

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      data: err.data,
      errors: err.errors
    });
  }

  // Fallback for unexpected errors
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    errors: []
  });
});


app.listen(port,()=>{
    console.log(`server is running on the port http://localhost:${port}`);
    connectDB();
})