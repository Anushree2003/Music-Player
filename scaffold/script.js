const audio = document.getElementById("audio")
const audioTitle = document.getElementById("audio-title")
const singerName = document.getElementById("audio-singer")
const imgSrc = document.getElementById("img")
const currentTime = document.getElementById("current-time")
const durationTime = document.getElementById("duration")
const skipBtn = document.getElementById("skip-back")
const playBtn = document.getElementById("play")
const forwardBtn = document.getElementById("skip-forward")
const progressBar = document.getElementById("progress-bar")
const progressHead = document.getElementById("progress-head")
const progress = document.getElementById("progress")
const likeBtn = document.getElementById("like")
const repeatBtn = document.getElementById("repeat")
const downloadBtn = document.getElementById("download")
const playlistBtn = document.getElementById("playlistBtn")
const likedPlaylist = document.getElementById("likedPlaylist")
const showPlaylist = document.getElementById("playlist")
const sideMenu = document.getElementById("side-menu")
const songList = document.getElementById('song-list')
const closeBtn = document.getElementById('close')

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
        source: "songs/Love Me.mp3",
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
    updateLikeButton()
    playsong(currentsong)
    songPlay()
}
function forward() {
    currentsong = (currentsong + 1) % tracks.length
    updateLikeButton()
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
let likedSongs = []

function popMsg(msg, iconClass) {
    let msgPopup = document.getElementById("popupMessage")
    if (!msgPopup) {
        msgPopup = document.createElement('div')
        msgPopup.id = 'popupMessage'
        msgPopup.className = 'popup-msg'
        document.body.appendChild(msgPopup)
    }
    msgPopup.innerHTML = `<i class="${iconClass}"></i>${msg}`
    msgPopup.classList.add('show')

    setTimeout(() => {
        msgPopup.classList.add('hide')
        setTimeout(() => {
            msgPopup.classList.remove('show', 'hide')
        }, 500)
    }, 2000)

}
function liked_song() {
    if (likedSongs.includes(tracks[currentsong].name)) {
        likedSongs = likedSongs.filter(song => song !== tracks[currentsong].name)
        likeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>'
        popMsg(`${tracks[currentsong].name} removed from favourites`, 'fa-solid fa-trash')
    }
    else {
        likedSongs.push(tracks[currentsong].name)
        likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>'
        popMsg(`${tracks[currentsong].name} added to favourites`, 'fa-solid fa-circle-check')
    }
    saveLikedSongs()
}

function updateLikeButton() {
    if (likedSongs.includes(tracks[currentsong].name)) {
        likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>'
    } else {
        likeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>'
    }
}

function loadLikedSongs() {
    const storeLikeSong = localStorage.getItem('likedSongs')
    if (storeLikeSong) {
        likedSongs = JSON.parse(storeLikeSong)
        updateLikeButton()
    }
}

function saveLikedSongs() {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs))
}

loadLikedSongs()

imgSrc.addEventListener('click', function () {
    songPlay()
})

function download_song() {
    const songUrl = `songs/${tracks[currentsong].name}.mp3`
    fetch(songUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${tracks[currentsong].name}.mp3`; 
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading song:', error));
}
let flag = false

function playNextSong(){
    currentsong = (currentsong + 1) % tracks.length
    playsong(currentsong)
    songPlay()
}

function playRandomSong(){
    randomIndex = Math.floor(Math.random()*tracks.length)
    playsong(randomIndex)
    console.log(randomIndex);
    songPlay()
}

function shuffle_song(){
    flag = !flag
    if(flag){
        repeatBtn.innerHTML = '<i class="fa-solid fa-shuffle"></i>'
        playRandomSong()
    }else{
        repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>'
        playNextSong()
    }
}

function playlist_show(){
    sideMenu.style.right = '0'
}

function playlist_hide(){
    sideMenu.style.right = '-250px';
}

likedSongs.forEach(song => {
    const songItem = document.createElement('li')
    songItem.textContent = song
    songList.appendChild(songItem)
})
    