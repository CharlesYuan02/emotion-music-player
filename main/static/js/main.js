let audio, playbtn, nextbtn, prevbtn, title, poster, seekslider, volumeslider, seeking = false, seekto,
    curtimetext, durtimetext, current_song, dir, playlist, ext, agent, repeat, setvolume;

dir = "static/songs/"
playlist = ["ACDC-BackinBlack", "OhTheLarceny-ManonaMission", "LedZeppelin-ImmigrantSong",
    "WillPharrell-Happy", "Kool&TheGang-Celebration", "RickAstley-NeverGonnaGiveYouUp",
    "SmashMouth-AllStar", "DJOkawari-SpeedofLight", "BillieEilish-BadGuy",
    "Adele-Hello", "CelineDion-MyHeartWillGoOn", "GaryJules-MadWorld"];

title = ["ACDC - Back in Black", "Oh The Larceny - Man on a Mission", "Led Zeppelin - Immigrant Song",
    "Will Pharrell - Happy", "Kool & The Gang - Celebration", "Rick Astley - Never Gonna Give You Up",
    "Smash Mouth - All Star", "DJ Okawari - Speed of Light", "Billie Eilish - Bad Guy",
    "Adele - Hello", "Celine Dion - My Heart Will Go On", "Gary Jules - Mad World"];

poster = ["song_imgs/back_in_black.jpg", "song_imgs/man_on_a_mission.jpg", "song_imgs/immigrant_song.jpg",
    "song_imgs/happy.jpg", "song_imgs/celebration.jpg", "song_imgs/never_gonna_give_you_up.jpg", "song_imgs/all_star.jpg",
    "speed_of_light.jpg", "song_imgs/bad_guy.jpg", "song_imgs/hello.jpg", "song_imgs/my_heart_will_go_on.jpg", "song_imgs/mad_world.jpg"];

ext = ".mp3";
agent = navigator.userAgent.toLowerCase()


playbtn = document.getElementById("playpausebtn");
nextbtn = document.getElementById("nextbtn");
prevbtn = document.getElementById("prevbtn");
seekslider = document.getElementById("seekslider");
volumeslider = document.getElementById("volumeslider");
curtimetext = document.getElementById("curtimetext");
durtimetext = document.getElementById("durtimetext");
current_song = document.getElementById("current_song");
repeat = document.getElementById("repeat");

playlist_index = 0;

audio = new Audio();
audio.src = dir + playlist[0] + ext;
audio.loop = false;

current_song.innerHTML = title[playlist_index];

playbtn.addEventListener("click", playPause);
nextbtn.addEventListener("click", nextSong);
prevbtn.addEventListener("click", prevSong);
seekslider.addEventListener("mousedown", function (event) {
    seeking = true;
    seek(event);
});
seekslider.addEventListener("mousemove", function (event) {
    seek(event);
})
seekslider.addEventListener("mouseup", function () {
    seeking = false;
})
volumeslider.addEventListener("mousemove", setvolume);
audio.addEventListener("timeupdate", function () {
    seektimeupdate();
})
audio.addEventListener("ended", function () {
    switchTrack();
})
repeat.addEventListener("click", loop);


function fetchMusicDetails() {
    $("#playpausebtn img").attr("src", "static/imgs/pause.png");
    $("#bgImage").attr("src", poster[playlist_index]);
    $("image").attr("src", poster[playlist_index]);

    current_song.innerHTML = title[playlist_index];

    audio.src = dir + playlist[playlist_index] + ext;
    audio.play();
}

function playPause() {
    if (audio.paused) {
        audio.play();
        console.log(playlist_index);
        $("#playpausebtn img").attr("src", "static/imgs/pause.png");
    } else {
        audio.pause();
        $("#playpausebtn img").attr("src", "static/imgs/play.png");
    }
}

function nextSong() {
    playlist_index++;
    if (playlist_index > playlist.length - 1) {
        playlist_index = 0;
    }
    fetchMusicDetails();
}

function prevSong() {
    playlist_index--;
    if (playlist_index < 0) {
        playlist_index = playlist.length - 1;
    }
    fetchMusicDetails();
}

function seek(event) {
    if (audio.duration == 0) {
        null
    } else {
        if (seeking) {
            seekslider.value = event.clientX - seekslider.offsetLeft;
            seekto = audio.duration * (seekslider.value / 100);
            audio.currentTime = seekto;
        }
    }
}

function setVolume() {
    audio.volume = volumeslider.value / 100;
}

function seektimeupdate() {
    if (audio.duration) {
        let temp = audio.currentTime * (100 / audio.duration);
        seekslider.value = temp;
        var curmins = Math.floor(audio.currentTime / 60);
        var cursecs = Math.floor(audio.currentTime - curmins * 60);
        var durmins = Math.floor(audio.duration / 60);
        var dursecs = Math.floor(audio.duration - durmins * 60);
        if (cursecs < 10) {
            cursecs = "0" + cursecs
        }
        if (curmins < 10) {
            curmins = "0" + curmins
        }
        if (dursecs < 10) {
            dursecs = "0" + dursecs
        }
        if (durmins < 10) {
            durmins = "0" + durmins
        }
        curtimetext.innerHTML = curmins + ":" + cursecs;
        durtimetext.innerHTML = durmins + ":" + dursecs;
    } else {
        curtimetext.innerHTML = "00:00";
        durtimetext.innerHTML = "00:00";
    }
}

function switchTrack() {
    if (playlist_index == playlist.length - 1) {
        playlist_index = 0;
    } else {
        playlist_index++;
    }
    fetchMusicDetails();
}

function loop() {
    if (audio.loop) {
        audio.loop = false;
        $("#repeat img").attr("src", "imgs/loop.png");
    } else {
        audio.loop = true;
        $("#repeat img").attr("src", "imgs/loop1.png");
    }
}