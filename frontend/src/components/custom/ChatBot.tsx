import { useGetChat } from '@/services/chat.service';
import { isAxiosError } from 'axios';
import { useState } from 'react';

function ChatBot() {
    // Chat box state
    const [showChat, setShowChat] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<
        { user: string; text: string }[]
    >([
        {
            user: 'LensAI',
            text: 'Welcome to PastLens🫡. How can I help you today',
        },
    ]);

    const { mutateAsync: chat, isPending } = useGetChat();

    const handleSendChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        try {
            const botResponse = await chat(chatMessages);
            if (isPending) {
                setChatMessages([
                    ...chatMessages,
                    { user: 'You', text: chatInput },
                    { user: 'LensAI', text: 'Thinking...' },
                ]);
            }
            if (botResponse) {
                setChatMessages([
                    ...chatMessages,
                    { user: 'You', text: chatInput },
                    { user: 'LensAI', text: botResponse.data },
                ]);
            }
        } catch (e) {
            console.log(e);
            if (isAxiosError(e)) console.log(e.response?.data.message);
        } finally {
            setChatInput('');
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className="group fixed bottom-8 left-8 z-50 bg-orange-600 hover:bg-orange-700 px-4 py-0 text-white rounded-full shadow-lg flex items-center cursor-pointer justify-center transition-all duration-200 min-h-16"
                onClick={() => setShowChat((v: boolean) => !v)}
                aria-label="Open chat"
            >
                <span className="font-bold text-lg align-center">💬</span>
                <span className="ml-2 max-w-0 group-hover:max-w-xs group-hover:opacity-100 opacity-0 overflow-hidden transition-all duration-300 py-2">
                    Ask LensAI
                </span>
            </button>
            {/* Chat Box */}
            {showChat && (
                <div className="fixed bottom-24 left-8 z-50 bg-white rounded-2xl shadow-2xl w-80 max-w-full p-4 flex flex-col">
                    <div className="font-bold text-[#1b1b1d] mb-2">
                        LensAI Chat
                    </div>
                    <div className="flex-1 overflow-y-auto mb-2 max-h-48">
                        {chatMessages.map(
                            (
                                msg: { user: string; text: string },
                                idx: number
                            ) => (
                                <div
                                    key={idx}
                                    className={`mb-2 text-sm ${msg.user === 'You' ? 'text-right' : 'text-left'}`}
                                >
                                    <span
                                        className={`inline-block px-3 py-2 rounded-xl ${msg.user === 'You' ? 'bg-[#eeeff1] text-[#1b1b1d]' : 'bg-orange-100 text-orange-700'}`}
                                    >
                                        {msg.text}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                    <form onSubmit={handleSendChat} className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 rounded-xl border border-[#eeeff1] focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <button
                            type="submit"
                            className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default ChatBot;
