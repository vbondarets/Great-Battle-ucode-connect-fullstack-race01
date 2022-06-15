var elements = document.querySelectorAll('button');
for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', function() {
        var myaudio = document.getElementById('myaudio');
        if (myaudio.paused) {
            myaudio.play();
        } else {
            myaudio.pause();
        }
    })
}