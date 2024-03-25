chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startTranscription') {
        const audioURL = message.audioURL;

        downloadAudio(audioURL)
            .then(audioData => {
                const transcription = transcribeAudio(audioData);
                sendResponse({ transcription: transcription });
            })
            .catch(error => {
                console.error('Error downloading audio:', error);
                sendResponse({ error: 'Error downloading audio' });
            });

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

function transcribeAudio(audioData) {
    const results = model.stt(audioData);
    return results;
}
