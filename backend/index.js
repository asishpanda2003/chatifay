import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";

connectDB();

const port=process.env.PORT || 5000;

//middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())

//Routes
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/message',messageRouter)

server.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});
