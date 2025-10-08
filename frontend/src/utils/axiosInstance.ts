import useUserStore from '@/stores/userStore';
import axios from 'axios';

const axInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

axInstance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${useUserStore.getState().user?.accessToken}`;
        return config;
    },
    (error) => Promise.reject(error)
);

console.log(useUserStore.getState().user?.accessToken);
export default axInstance;
