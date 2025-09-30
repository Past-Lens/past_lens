import axInstance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';

type ChatHistoryType = {
    user: string;
    text: string;
};

export const useGetChat = () => {
    return useMutation({
        mutationKey: ['GET_CHATBOT_RESPONSE'],
        mutationFn: async (chatHistory: ChatHistoryType[]) => {
            const chatResponse = await axInstance.post('/chat', chatHistory);
            return chatResponse;
        },
    });
};
