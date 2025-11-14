import useUserStore from '@/stores/userStore';
import axios from 'axios';

const baseURL = 'http://localhost:5000/api';
//const baseURL = 'https://past-lensbackend.onrender.com/api';

const axInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

axInstance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${useUserStore.getState().user?.accessToken}`;
        return config;
    },
    (error) => Promise.reject(error)
);
export default axInstance;
