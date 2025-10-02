function speechToText(): string {
    let result = '';
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        result = transcript;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) =>
        console.error(event.error);

    recognition.start();

    return result;
}

function textToSpeech(text: string) {
    const speechUtterance = new window.SpeechSynthesisUtterance(text);

    speechUtterance.rate = 1;
    speechUtterance.volume = 1;
    speechUtterance.pitch = 1;
    speechUtterance.voice =
        speechSynthesis.getVoices().find((v) => v.lang === 'en-US') || null;

    speechSynthesis.speak(speechUtterance);
}

export { speechToText, textToSpeech };
