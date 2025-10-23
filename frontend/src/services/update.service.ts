import axInstance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';

type Payload = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
};

const useUpdateProfile = () => {
    return useMutation({
        mutationKey: ['UPDATE_PROFILE'],
        mutationFn: async (payload: Payload) => {
            const newProfile = await axInstance.put('/user/profile', payload);
            return newProfile;
        },
    });
};
export default useUpdateProfile;
