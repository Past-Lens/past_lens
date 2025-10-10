import useUserStore from '@/stores/userStore';
import axios from 'axios';

// const baseURLLocal = 'http://localhost:5000/api'
const baseURLRemote = 'https://past-lens-backend.vercel.app/';

const axInstance = axios.create({
    baseURL: baseURLRemote,
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
