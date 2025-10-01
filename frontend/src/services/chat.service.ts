import axInstance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';

export const useGetChat = () => {
    return useMutation({
        mutationKey: ['GET_CHATBOT_RESPONSE'],
        mutationFn: async (chatInput: string) => {
            const chatResponse = await axInstance.post('/chat', { chatInput });
            return chatResponse;
        },
    });
};
