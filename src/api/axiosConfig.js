import axios from 'axios';

const instance = axios.create({
    // Updated with your live Render URL
    baseURL: 'https://aifsd-mse2-lost-found.onrender.com/api' 
});

export default instance;