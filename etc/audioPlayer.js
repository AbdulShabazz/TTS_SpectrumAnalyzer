document.addEventListener("DOMContentLoaded", function () {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = new Audio('AE.b_a_t_EN_accent_ad.mp3');
    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var gainNode = audioCtx.createGain();

    audioSrc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    var playPauseBtn = document.getElementById('playPauseBtn');
    var volumeControl = document.getElementById('volumeControl');
    var muteBtn = document.getElementById('muteBtn');
    var scrubber = document.getElementById('scrubber');

    playPauseBtn.addEventListener('click', function() {
        if(audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if(this.textContent === 'Play') {
            audioElement.play();
            this.textContent = 'Pause';
        } else {
            audioElement.pause();
            this.textContent = 'Play';
        }
    });

    volumeControl.addEventListener('input', function() {
        gainNode.gain.value = this.value;
    });

    muteBtn.addEventListener('click', function() {
        if(audioElement.muted) {
            audioElement.muted = false;
            this.textContent = 'Mute';
        } else {
            audioElement.muted = true;
            this.textContent = 'Unmute';
        }
    });

    scrubber.addEventListener('input', function() {
        var scrubTime = audioElement.duration * (this.value / 100);
        audioElement.currentTime = scrubTime;
    });

    audioElement.addEventListener('timeupdate', function() {
        var value = (100 / audioElement.duration) * audioElement.currentTime;
        scrubber.value = value;
    });

    audioElement.addEventListener('ended', function() {
        playPauseBtn.textContent = 'Play';
        scrubber.value = 0;
    });
});
