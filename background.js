const openai = require('openai');
const fetch = require('node-fetch');
import 'dotenv/config'

const openaiApiKey = "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"
const openaiClient = new openai.OpenAIApi(openaiApiKey);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startTranscription') {
        const audioURL = message.audioURL;

        downloadAudio(audioURL)
            .then(audioData => {
                transcribeAudio(audioData)
                    .then(transcription => {
                        sendResponse({ transcription: transcription });
                    })
                    .catch(error => {
                        console.error('Error transcribing audio:', error);
                        sendResponse({ error: 'Error transcribing audio' });
                    });
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

async function transcribeAudio(audioData) {
    try {
        const response = await openaiClient.speechToText({
            audio: audioData,
            model: 'davinci',
            contentType: 'audio/wav'
        });
        return response.data.text;
    } catch (error) {
        throw new Error('Failed to transcribe audio');
    }
}