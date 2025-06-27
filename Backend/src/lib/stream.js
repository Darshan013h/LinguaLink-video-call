import {StreamChat} from "stream-chat"
import dotenv from 'dotenv';


dotenv.config();

const apikey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apikey || !apiSecret){
    console.error("stream api key or secret is missing");
}

const streamClient = StreamChat.getInstance(apikey,apiSecret);

export const upsertStreamUser = async (userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData
    } catch (error) {
        console.error("error upserting Stream User");
    }
};

export const generateStreamToken = (userId)=>{
    try {
        //ensure userId is in string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream Token:",error); 
    }
}
