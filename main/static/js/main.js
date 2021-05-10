let mood, audio, playbtn, nextbtn, prevbtn, mutebtn, seekslider, volumeslider, seeking = false, seekto,
    curtimetext, durtimetext, current_song, dir, playlist, ext, agent, repeat, setvolume, angry_playlist, angry_title,
    angry_poster, happy_playlist, happy_title, happy_poster, calm_playlist, calm_title, calm_poster, sad_playlist,
    sad_title, sad_poster, playlist_index;

dir = "static/songs/"

angry_playlist = ["ACDC-BackinBlack", "OhTheLarceny-ManonaMission", "LedZeppelin-ImmigrantSong"];
angry_title = ["ACDC - Back in Black", "Oh The Larceny - Man on a Mission", "Led Zeppelin - Immigrant Song"];
angry_poster = ["static/song_imgs/back_in_black.jpg", "static/song_imgs/man_on_a_mission.jpg", "static/song_imgs/immigrant_song.jpg"];

happy_playlist = ["WillPharrell-Happy", "Kool&TheGang-Celebration", "RickAstley-NeverGonnaGiveYouUp"];
happy_title = ["Will Pharrell - Happy", "Kool & The Gang - Celebration", "Rick Astley - Never Gonna Give You Up"];
happy_poster = ["static/song_imgs/happy.jpg", "static/song_imgs/celebration.jpg", "static/song_imgs/never_gonna_give_you_up.jpg"];

calm_playlist = ["SmashMouth-AllStar", "DJOkawari-SpeedofLight", "BillieEilish-BadGuy"];
calm_title = ["Smash Mouth - All Star", "DJ Okawari - Speed of Light", "Billie Eilish - Bad Guy"];
calm_poster = ["static/song_imgs/all_star.jpeg", "static/song_imgs/speed_of_light.jpg", "static/song_imgs/bad_guy.jpg"];

sad_playlist = ["Adele-Hello", "CelineDion-MyHeartWillGoOn", "GaryJules-MadWorld"];
sad_title = ["Adele - Hello", "Celine Dion - My Heart Will Go On", "Gary Jules - Mad World"];
sad_poster = ["static/song_imgs/hello.JPG", "static/song_imgs/my_heart_will_go_on.jpg", "static/song_imgs/mad_world.jpg"];

ext = ".mp3";
agent = navigator.userAgent.toLowerCase()

playbtn = document.getElementById("playpausebtn");
nextbtn = document.getElementById("nextbtn");
prevbtn = document.getElementById("prevbtn");
mutebtn = document.getElementById("mutebtn");
seekslider = document.getElementById("seekslider");
volumeslider = document.getElementById("volumeslider");
curtimetext = document.getElementById("curtimetext");
durtimetext = document.getElementById("durtimetext");
current_song = document.getElementById("current_song");
repeat = document.getElementById("repeat");

audio = new Audio();
audio.loop = false;

Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach('#imageCapture');

playbtn.addEventListener("click", playPause);
nextbtn.addEventListener("click", () => { nextSong(mood) });
prevbtn.addEventListener("click", () => { prevSong(mood) });
mutebtn.addEventListener("click", mute);
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
    switchTrack(mood);
})
repeat.addEventListener("click", loop);


function fetchMusicDetails(mood) {
    $("#playpausebtn img").attr("src", "static/imgs/pause.png");
    switch (mood) {
        case "Angry":
            $("#circle-image img").attr("src", angry_poster[playlist_index]);
            current_song.innerHTML = angry_title[playlist_index];
            audio.src = dir + angry_playlist[playlist_index] + ext;
            break;

        case "Happy":
            $("#circle-image img").attr("src", happy_poster[playlist_index]);
            current_song.innerHTML = happy_title[playlist_index];
            audio.src = dir + happy_playlist[playlist_index] + ext;
            break;

        case "Calm":
            $("#circle-image img").attr("src", calm_poster[playlist_index]);
            current_song.innerHTML = calm_title[playlist_index];
            audio.src = dir + calm_playlist[playlist_index] + ext;
            break;

        case "Sad":
            $("#circle-image img").attr("src", sad_poster[playlist_index]);
            current_song.innerHTML = sad_title[playlist_index];
            audio.src = dir + sad_playlist[playlist_index] + ext;
            break;
    }
    audio.play();
}

function playPause() {
    if (audio.paused) {
        audio.play();
        $("#playpausebtn img").attr("src", "static/imgs/pause.png");
    } else {
        audio.pause();
        $("#playpausebtn img").attr("src", "static/imgs/play.png");
    }
}

function nextSong(mood) {
    playlist_index++;
    switch (mood) {
        case "Angry":
            if (playlist_index > angry_playlist.length - 1) {
                playlist_index = 0;
            }
            break;
        case "Happy":
            if (playlist_index > happy_playlist.length - 1) {
                playlist_index = 0;
            }
            break;
        case "Calm":
            if (playlist_index > calm_playlist.length - 1) {
                playlist_index = 0;
            }
            break;
        case "Sad":
            if (playlist_index > sad_playlist.length - 1) {
                playlist_index = 0;
            }
            break;
    }
    fetchMusicDetails(mood);
}

function prevSong(mood) {
    playlist_index--;
    switch (mood) {
        case "Angry":
            if (playlist_index < 0) {
                playlist_index = angry_playlist.length - 1;
            }
            break;
        case "Happy":
            if (playlist_index < 0) {
                playlist_index = happy_playlist.length - 1;
            }
            break;
        case "Calm":
            if (playlist_index < 0) {
                playlist_index = calm_playlist.length - 1;
            }
            break;
        case "Sad":
            if (playlist_index < 0) {
                playlist_index = sad_playlist.length - 1;
            }
            break;
    }
    fetchMusicDetails(mood);
}

function mute() {
    if (audio.muted) {
        audio.muted = false;
        $("#mutebtn img").attr("src", "static/imgs/speaker.png");
    } else {
        audio.muted = true;
        $("#mutebtn img").attr("src", "static/imgs/mute.png");
    }
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

function switchTrack(mood) {
    switch (mood) {
        case "Angry":
            if (playlist_index == angry_playlist.length - 1) {
                playlist_index = 0;
            } else {
                playlist_index++;
            }
            break;
        case "Happy":
            if (playlist_index == happy_playlist.length - 1) {
                playlist_index = 0;
            } else {
                playlist_index++;
            }
            break;
        case "Calm":
            if (playlist_index == calm_playlist.length - 1) {
                playlist_index = 0;
            } else {
                playlist_index++;
            }
            break;
        case "Sad":
            if (playlist_index == sad_playlist.length - 1) {
                playlist_index = 0;
            } else {
                playlist_index++;
            }
            break;
    }
    fetchMusicDetails(mood);
}

function loop() {
    if (audio.loop) {
        audio.loop = false;
        $("#repeat img").attr("src", "static/imgs/loop.png");
    } else {
        audio.loop = true;
        $("#repeat img").attr("src", "static/imgs/loop1.png");
    }
}

document.querySelector('#test').addEventListener('click', function () {
    getExpression();
});

const getExpression = () => {
    Webcam.snap(image_uri => {
        console.log(image_uri)
        fetch('/expression', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image_uri: image_uri })
        }).then(response => {
            return response.json();
        }).then(res => {
            mood = res.mood;
            mood = mood.charAt(0).toUpperCase() + mood.slice(1);
            document.querySelector('#status').innerHTML = `Current Mood: ${mood}`;
            switch (mood) {
                case "Angry":
                    playlist_index = 0;
                    audio.src = dir + angry_playlist[0] + ext;
                    current_song.innerHTML = angry_title[playlist_index];
                    $("#circle-image img").attr("src", angry_poster[playlist_index]);
                    $("body").css("background-image", "linear-gradient(to bottom, rgb(255, 0, 0) , rgb(255, 0, 76))");
                    break;
                case "Happy":
                    playlist_index = 0;
                    audio.src = dir + happy_playlist[0] + ext;
                    current_song.innerHTML = happy_title[playlist_index];
                    $("#circle-image img").attr("src", happy_poster[playlist_index]);
                    $("body").css("background-image", "linear-gradient(to bottom, rgba(188, 203, 7, 1) 0%, rgba(219, 203, 88, 1) 100%)");
                    break;
                case "Calm":
                    playlist_index = 0;
                    audio.src = dir + calm_playlist[0] + ext;
                    current_song.innerHTML = calm_title[playlist_index];
                    $("#circle-image img").attr("src", calm_poster[playlist_index]);
                    $("body").css("background-image", "linear-gradient(to bottom, rgba(137, 170, 75, 1) 0%, rgba(77, 138, 9, 1) 100%)");
                    break;
                case "Sad":
                    playlist_index = 0;
                    audio.src = dir + sad_playlist[0] + ext;
                    current_song.innerHTML = sad_title[playlist_index];
                    $("#circle-image img").attr("src", sad_poster[playlist_index]);
                    $("body").css("background-image", "linear-gradient(to bottom, rgba(14, 9, 121, 1) 69%, rgba(0, 189, 255, 1) 100%)");
                    break;
            }
        });
    });
}

setTimeout(() => { getExpression() }, 2000);
