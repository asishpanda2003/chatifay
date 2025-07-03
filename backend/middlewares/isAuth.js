import jwt from "jsonwebtoken";

const isAuth= async(req,res,next)=>{
    try {
        let token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:"Unauthorized, please login first"});
        } 
        let verifyToken = await jwt.verify(token,process.env.JWT_SECRET)
        // console.log(verifyToken);
        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        return res.status(500).json({message:"isAuth error",error:error.message});
    }
}

export default isAuth;