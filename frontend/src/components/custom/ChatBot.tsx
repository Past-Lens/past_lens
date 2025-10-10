import { useGetChat } from '@/services/chat.service';
import { isAxiosError } from 'axios';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUp, Mic, Square, X } from 'lucide-react';
// import { speechToText, textToSpeech } from '@/utils/speechText';
import { Button } from '../ui/button';

function ChatBot() {
    const [listening, setListening] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
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

    const { mutateAsync: chat } = useGetChat();

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSendChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        // Add user message and 'Thinking...' placeholder
        setChatMessages((prev) => [
            ...prev,
            { user: 'You', text: chatInput },
            { user: 'LensAI', text: 'Thinking...' },
        ]);
        setChatInput('');
        try {
            const botResponse = await chat(chatInput);
            if (
                botResponse &&
                botResponse.data &&
                botResponse.data.botResponse
            ) {
                setChatMessages((prev) => {
                    // Remove the last 'Thinking...' message and add the real response
                    const lastThinkingIdx = prev.findIndex(
                        (msg, i) =>
                            msg.user === 'LensAI' &&
                            msg.text === 'Thinking...' &&
                            i === prev.length - 1
                    );
                    const newMessages =
                        lastThinkingIdx !== -1
                            ? prev.slice(0, lastThinkingIdx)
                            : prev;
                    return [
                        ...newMessages,
                        { user: 'LensAI', text: botResponse.data.botResponse },
                    ];
                });
            }
        } catch (e) {
            setChatMessages((prev) => {
                // Remove the last 'Thinking...' message and add error
                const lastThinkingIdx = prev.findIndex(
                    (msg, i) =>
                        msg.user === 'LensAI' &&
                        msg.text === 'Thinking...' &&
                        i === prev.length - 1
                );
                const newMessages =
                    lastThinkingIdx !== -1
                        ? prev.slice(0, lastThinkingIdx)
                        : prev;
                return [
                    ...newMessages,
                    { user: 'LensAI', text: 'Something went Wrong!!' },
                ];
            });
            console.log(e);
            if (isAxiosError(e)) console.log(e.response?.data.message);
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
                <div
                    className="fixed bottom-24 left-8 z-50 bg-slate-50 rounded-2xl shadow-2xl w-[35rem] 
                max-w-full flex flex-col max-h-[40rem] h-[100%] p-4 border border-orange-800"
                >
                    <div
                        className="font-bold text-[#c05509] mb-2 flex items-center justify-between
                    h-16 border border-slate-300 rounded-lg shadow-md"
                    >
                        <div className="flex items-center">
                            <img src="./PLTransparent.png" width={80} />
                            LensAI Chat
                        </div>
                        <Button
                            onClick={() => setShowChat(false)}
                            className="bg-orange-700 m-2 cursor-pointer"
                        >
                            <X />
                        </Button>
                    </div>
                    <div
                        ref={chatContainerRef}
                        className="flex-1 max-h-[90%] custom-scrollbar-hide"
                        style={{
                            overflowY: 'auto',
                        }}
                    >
                        {chatMessages.map(
                            (
                                msg: { user: string; text: string },
                                idx: number
                            ) => (
                                <div
                                    key={idx}
                                    className={`mb-2 text-sm font-semibold ${msg.user === 'You' ? 'text-right' : 'text-left'}`}
                                >
                                    {msg.user === 'LensAI' ? (
                                        <span
                                            className="inline-block px-3 py-2 rounded-xl bg-orange-100 text-orange-900 mr-8 prose prose-sm max-w-[90%] text-left"
                                            style={{
                                                wordBreak: 'break-word',
                                                whiteSpace: 'pre-line',
                                            }}
                                        >
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </span>
                                    ) : (
                                        <span className="inline-block px-3 py-2 rounded-xl bg-[#eeeff1] text-[#1b1b1d] ml-8">
                                            {msg.text}
                                        </span>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                    <form
                        onSubmit={handleSendChat}
                        className="w-full flex items-end rounded-b-2xl border-t border-slate-300 pt-2"
                    >
                        <div className="relative w-full ">
                            <textarea
                                value={chatInput}
                                onChange={(e) => {
                                    setChatInput(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height =
                                        Math.min(e.target.scrollHeight, 120) +
                                        'px';
                                }}
                                placeholder={
                                    listening
                                        ? 'Listening...'
                                        : 'Type your message...'
                                }
                                className="w-full pr-24 px-3 py-2 rounded-xl border border-[#eeeff1] shadow-md
                                 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none bg-white custom-scrollbar-hide"
                                style={{
                                    minHeight: '2.5rem',
                                    maxHeight: '7.5rem',
                                    overflowY: 'hidden',
                                }}
                                disabled={listening}
                            />
                            {/* Audio Button */}
                            <button
                                type="button"
                                title={
                                    listening
                                        ? 'Stop recording'
                                        : 'Dictate your prompt'
                                }
                                aria-label={
                                    listening
                                        ? 'Stop recording'
                                        : 'Dictate your prompt'
                                }
                                className={`absolute right-14 bottom-5 flex items-center justify-center cursor-pointer
                                     w-10 h-10 rounded-full bg-orange-600 text-white shadow-md border-2 border-white transition-colors ${listening ? 'bg-red-600' : ''}`}
                                style={{
                                    background: listening
                                        ? '#e53935'
                                        : '#ff7300',
                                }}
                                onClick={() => {
                                    setListening((v) => !v);
                                    // console.log(speechToText());
                                }}
                                tabIndex={-1}
                            >
                                {listening ? (
                                    <Square size={22} color="#fff" />
                                ) : (
                                    <Mic size={22} color="#fff" />
                                )}
                            </button>
                            {/* Send Button */}
                            <button
                                type="submit"
                                title="Send Chat"
                                aria-label="Send Chat"
                                className="absolute right-2 bottom-5 flex items-center justify-center cursor-pointer
                                 w-10 h-10 rounded-full bg-orange-600 text-white shadow-md border-2 border-white"
                                style={{ background: '#ff7300' }}
                            >
                                <ArrowUp size={22} color="#fff" />
                            </button>
                        </div>
                    </form>
                    <style>{`
                        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
                        .custom-scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
                    `}</style>
                </div>
            )}
        </>
    );
}

export default ChatBot;
