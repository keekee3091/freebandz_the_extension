const openaiApiKey = "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";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'startTranscription') {
        const audioURL = message.audioURL;

        try {
            const audioData = await downloadAudio(audioURL);
            const transcription = await transcribeAudio(audioData);
            sendResponse({ transcription: transcription });
        } catch (error) {
            console.error('Error:', error);
            sendResponse({ error: error.message });
        }

        return true;
    }
});

async function downloadAudio(url) {
    const response = await fetch(url);
    if (response.ok) {
        return await response.arrayBuffer();
    } else {
        throw new Error('Failed to download audio file');
    }
}

async function transcribeAudio(audioData) {
    const formData = new FormData();
    formData.append('audio', new Blob([audioData]), 'audio.wav');

    const response = await fetch('https://api.openai.com/v1/speech-to-text', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to transcribe audio');
    }

    const data = await response.json();
    return data.text;
}
