function speechToText() {
    // let result = '';
    // const SpeechRecognition =
    //     window.SpeechRecognition || window.webkitSpeechRecognition;
    // const recognition = new SpeechRecognition();

    // recognition.lang = 'en-US';
    // recognition.interimResults = false;
    // recognition.continuous = false;

    // recognition.onresult = (event: SpeechRecognitionEvent) => {
    //     const transcript = event.results[0][0].transcript;
    //     result = transcript;
    // };

    // recognition.onerror = (event: SpeechRecognitionErrorEvent) =>
    //     console.error("Speech recognition error: ", event.error);

    // recognition.start();

    // return result;
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });

            // create a temporary URL for playback
            const audioUrl = URL.createObjectURL(audioBlob);

            // make an <audio> element to play it
            const audio = new Audio(audioUrl);
            audio.play(); // 🔊 play the recording
        };

        mediaRecorder.start();
        console.log('Recording started...');
        // const formData = new FormData();
        // formData.append('file', audioBlob, 'recording.webm');

        // // send to backend for Whisper transcription
        // fetch("/api/transcribe", { method: "POST", body: formData });

        mediaRecorder.start();

        // stop after 5 seconds for demo
        setTimeout(() => mediaRecorder.stop(), 5000);
    };
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
