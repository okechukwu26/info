import axios from "axios"


const axiosInstance =axios.create({
    baseURL:"https://gig-hnuf.onrender.com",
    headers:{
        "Content-Type":"application/json"
    }
})

export default axiosInstance