async function downloadAudioAsMP3(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to download audio file');
    }
    const audioData = await response.arrayBuffer()
    const audioBlob = new Blob([audioData], {type: 'audio/wav'});
    const audioURL = URL.createObjectURL(audioBlob);

    return audioURL
}

const videoScript = document.querySelector('head script[type="application/ld+json"]');

if (videoScript) {
    const videoData = JSON.parse(videoScript.textContent);
    
    if (videoData && videoData['@context'] && videoData['@type'] && videoData['potentialAction'] && videoData['potentialAction']['target']) {
        const videoURL = videoData['potentialAction']['target'];

        downloadAudioAsMP3(videoURL)
        .then(mp3URL => {
        console.log('Video URL:', mp3URL);

        chrome.runtime.sendMessage({ action: 'startTranscription', audioURL: mp3URL });
        })
        
    } else {
        console.log('Invalid or missing video script data');
    }
} else {
    console.log('Video script element not found');
}
