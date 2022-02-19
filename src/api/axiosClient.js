import axios from 'axios';

const fallbackURL = "https://wad2-g8t1-backend.herokuapp.com"


const axiosClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL || fallbackURL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true
});

export {
    axiosClient
}
