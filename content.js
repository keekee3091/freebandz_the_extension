const videoLink = document.querySelector('a[href*="wvideo"]');

if (videoLink) {
    const videoURL = videoLink.getAttribute('href');

    fetch(videoURL)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const videoElement = doc.querySelector('video');

            if (videoElement) {
                console.log('Video element found', videoElement);

                chrome.runtime.sendMessage({ action: 'startTranscription', audioURL: videoURL });
            } else {
                console.log('Video element not found', videoURL);
            }
        })
        .catch(error => {
            console.error('Error fetching video page', error);
        });
} else {
    console.log('Video link not found');
}
