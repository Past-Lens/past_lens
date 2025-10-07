// Utility to record audio via MediaRecorder and return an audio Blob.
// Returns a Promise that resolves to the recorded Blob.
export async function startRecording(durationMs = 5000): Promise<Blob> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    return new Promise<Blob>((resolve, reject) => {
        try {
            const mediaRecorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

            mediaRecorder.onerror = (_ev) => {
                // stop tracks
                try {
                    stream.getTracks().forEach((t) => t.stop());
                } catch {}
                reject(new Error('MediaRecorder error'));
            };

            mediaRecorder.onstop = () => {
                try {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    // stop all tracks
                    try {
                        stream.getTracks().forEach((t) => t.stop());
                    } catch {}
                    resolve(audioBlob);
                } catch (err) {
                    reject(err);
                }
            };

            mediaRecorder.start();
            // ensure we stop after durationMs
            setTimeout(() => {
                if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
            }, durationMs);
        } catch (err) {
            try {
                stream.getTracks().forEach((t) => t.stop());
            } catch {}
            reject(err);
        }
    });
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

// Record audio, upload to backend transcription endpoint, and return the transcript string.
export async function speechToText(durationMs = 5000): Promise<string> {
    try {
        const audioBlob = await startRecording(durationMs);

        const fd = new FormData();
        // backend may expect 'file' or 'audio' — try 'file'
        fd.append('file', audioBlob, 'recording.webm');

        const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: fd,
        });
        if (!res.ok) {
            const text = await res.text();
            console.warn('Transcription failed:', text);
            return '';
        }

        const data = await res
            .json()
            .catch(async () => ({ text: await res.text() }));
        // support common field names
        return (data.transcript || data.text || data.result || '') as string;
    } catch (err) {
        console.error('speechToText failed', err);
        return '';
    }
}

export { textToSpeech };
