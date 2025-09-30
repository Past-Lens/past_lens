import axios from 'axios';

const axInstance = axios.create({
    baseURL: 'http://localhost:5000/api/',
    withCredentials: true,
});
export default axInstance;
