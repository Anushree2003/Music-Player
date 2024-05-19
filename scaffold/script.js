audio = document.getElementById("audio")
audioTitle = document.getElementById("audio-title")
singerName = document.getElementById("audio-singer")
imgSrc = document.getElementById("img")
currentTime = document.getElementById("current-time")
durationTime = document.getElementById("duration")
skipBtn = document.getElementById("skip-back")
playBtn = document.getElementById("play")
forwardBtn = document.getElementById("skip-forward")
progressBar = document.getElementById("progress-bar")
progressHead = document.getElementById("progress-head")
progress = document.getElementById("progress")


tracks = [
    {
        name: "Let me down slowly",
        artist: "Alec Benjamin",
        cover: "images/letmedownslowly.jpg",
        source: "songs/Let Me Down Slowly.mp3",
    },
    {
        name: "Love Me",
        artist: "Justin Bieber",
        cover: "images/loveme.jpg",
        source: "songs/Love-Me.mp3",
    },
    {
        name: "Closer",
        artist: "Chainsmokers",
        cover: "images/closer.jpeg",
        source: "songs/Closer.mp3",
    },

];

var currentsong = 0
function playsong(songIndex) {
    const song = tracks[songIndex]
    audio.src = song.source
    imgSrc.src = song.cover
    audioTitle.textContent = song.name
    singerName.textContent = song.artist
    audio.load()
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
}
playsong(currentsong)

function songPlay() {
    if (audio.paused) {
        audio.play()
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'
    } else {
        audio.pause()
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
    }
}
function backwards() {
    currentsong = (currentsong - 1 + tracks.length) % tracks.length
    playsong(currentsong)
    songPlay()
}
function forward() {
    currentsong = (currentsong + 1) % tracks.length
    playsong(currentsong)
    songPlay()
}
audio.addEventListener('timeupdate', () => {
    updateProgressBar()
})

audio.addEventListener('loadedmetadata', () => {
    durationTime.textContent = time_format(audio.duration)
})

audio.addEventListener("ended", () => {
    currentsong = (currentsong + 1) % tracks.length
    playsong(currentsong)
    songPlay()
})

function updateProgressBar() {
    const progress = (audio.currentTime / audio.duration) * 100
    progressBar.style.width = `${progress}%`
    progressHead.style.left = `${progress}%`
    currentTime.textContent = time_format(audio.currentTime)
}

function time_format(seconds) {
    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
progress.addEventListener("click", setSongPlayPoint)

function setSongPlayPoint(e) {
    const progressContainer = progress.getBoundingClientRect()
    console.log(progressContainer);
    const x_dist = e.clientX
    const position = x_dist - progressContainer.left
    const width_covered = progressContainer.width
    const clickedPosition = position / width_covered
    const newTime = clickedPosition * audio.duration
    audio.currentTime = newTime
}



