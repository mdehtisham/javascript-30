const playPauseBtn = document.querySelector('.play-pause-btn')
const video = document.querySelector('video')
const videoContainer = document.querySelector('.video-container')
const theaterBtn = document.querySelector('.theater-btn')
const miniPlayerBtn = document.querySelector('.mini-player-btn')
const fullScreenBtn = document.querySelector('.full-screen-btn')
const muteBtn = document.querySelector('.mute-btn')
const volumeSlider = document.querySelector('.volume-slider')

// Viewing Modes
theaterBtn.addEventListener('click', toggleTheaterMode)
miniPlayerBtn.addEventListener('click', toggleMiniPlayerMode)
fullScreenBtn.addEventListener('click', toggleFullScreenMode)

// Volume
muteBtn.addEventListener('click', toggleMute)
volumeSlider.addEventListener('input', e => {
    video.volume = e.target.value;
    video.muted = e.target.value === 0;
})

function toggleMute(){
    video.muted = !video.muted;
}

video.addEventListener('volumechange', ()=> {
    volumeSlider.value = video.value;
    let volumeLevel;
    if(video.muted || video.volume === 0){
        volumeSlider.value = 0;
        volumeLevel = "muted"
    }else if(video.volume >= 0.5){
        volumeLevel = "high"
    }else{
        volumeLevel = "low"
    }

    videoContainer.dataset.volumeLevel = volumeLevel;
})


function toggleTheaterMode(){
    videoContainer.classList.toggle("theater")
}
function toggleFullScreenMode(){
    if(document.fullscreenElement == null){
        videoContainer.requestFullscreen();
    }else{
        document.exitFullscreen()
    }
}
function toggleMiniPlayerMode(){
    if(videoContainer.classList.contains('mini-player')){
        document.exitPictureInPicture();
    }else{
        video.requestPictureInPicture()
    }
}

// listen for mini-player enterpictureinpicture event
video.addEventListener('enterpictureinpicture', ()=> {
    videoContainer.classList.add('mini-player')
})
// listen for mini-player leavepictureinpicture event
video.addEventListener('leavepictureinpicture', ()=> {
    videoContainer.classList.remove('mini-player')
})

// listen for full screen change
document.addEventListener('fullscreenchange', ()=> {
    videoContainer.classList.toggle('full-screen', document.fullscreenElement)
})


// handling the toggle play and pause on click
playPauseBtn.addEventListener('click', ()=> {
togglePlayPause()
})

// handling the toggle play and pause on click of the video
video.addEventListener('click', togglePlayPause)

// handling the toggle play and pause on 'space'/'k' key press
document.addEventListener('keydown', e => {
    const tagName = document.activeElement.tagName.toLowerCase();
    if(tagName === 'input') return;

    switch(e.key.toLowerCase()){
        case " ":
            if(tagName === 'button') return;
        case "k":
            togglePlayPause()
            break;
        case 'f':
            toggleFullScreenMode();
            break;
        case 't':
            toggleTheaterMode();
            break;
        case 'i':
            toggleMiniPlayerMode();
            break;
        case 'm':
            toggleMute()
            break;
    }
})

function togglePlayPause(){
    video.paused ? video.play() : video.pause();
}


video.addEventListener('play', ()=> {
    videoContainer.classList.remove('paused')
})
video.addEventListener('pause', ()=> {
    videoContainer.classList.add('paused')
})