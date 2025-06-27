
import axios from 'axios'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api"
export const axiosInstance = axios.create({
    baseURL :BASE_URL ,
    //when we want to send request, we will send the cookies which have tokens with the request
    withCredentials: true //which says send cookies with the request 
})