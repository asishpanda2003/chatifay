import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req,res)=>{
    try {
        const sender = req.userId;
        const {receiver} = req.params;
        const {message} = req.body;
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }

        const conversation = await Conversation.findOne({
            partcipants:{$all:[sender,receiver]}
        })

        const newMessage = await Message.create({
            sender,receiver,message,image
        })

        if(!conversation){
            conversation=await Conversation.create({
                partcipants:[sender,receiver],
                messages:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }

        const receiverSocketId = getReceiverSocketId(receiver)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        return res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:`send Message error ${error}`});
    }
}

export const getMessages = async (req,res)=>{
    try {
        const sender = req.userId;
        const {receiver} = req.params;
        const conversation = await Conversation.findOne({
            partcipants:{$all:[sender,receiver]}
        }).populate("messages")
        if(!conversation){
            return res.status(400).json({message:"Conversation not found"})
        }
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:`get Message error ${error}`});
    }
}