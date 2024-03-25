const videoScript = document.querySelector('head script[type="application/ld+json"]');

if (videoScript) {
    const videoData = JSON.parse(videoScript.textContent);
    
    if (videoData && videoData['@context'] && videoData['@type'] && videoData['potentialAction'] && videoData['potentialAction']['target']) {
        const videoURL = videoData['potentialAction']['target'];
        console.log('Video URL:', videoURL);

        chrome.runtime.sendMessage({ action: 'startTranscription', audioURL: videoURL });
    } else {
        console.log('Invalid or missing video script data');
    }
} else {
    console.log('Video script element not found');
}
