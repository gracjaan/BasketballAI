window.addEventListener("helpersLoaded", async () => {
    await insertSounds()
})

async function insertSounds() {
    const listOfSounds = document.getElementById('soundList')
    const files = ['buzzer.mp3', 'commentary.mp3', 'swish.mp3']
    console.log(files)
    for (var i = 0; i < files.length; i++) {
        var fileName = files[i];
        var listItem = generateSoundList(fileName)
        listOfSounds.appendChild(listItem)
    }

}

function generateSoundList(soundTitel) {
    const orderedSoundList = document.getElementById("soundList");

    const listElement = document.createElement("li");

    const titleDiv = document.createElement("div");
    const titlePara = document.createElement("p");
    titlePara.classList.add("font-bold");
    titlePara.innerText = soundTitel;
    titleDiv.appendChild(titlePara);
    listElement.appendChild(titleDiv);

    const audioDiv = document.createElement("div");
    audioDiv.classList.add("rounded-xl")

    // Create an image for the play/pause button
    const playPauseButton = document.createElement("img");
    playPauseButton.id = "playPause";
    playPauseButton.src = "../static/assets/Frameplay.svg";
    playPauseButton.alt = "playButton";
    playPauseButton.onclick = playSound

    // Create an audio element
    const audioPlayer = document.createElement("audio");
    audioPlayer.classList.add("hidden");
    audioPlayer.id = "audioPlayer";
    audioPlayer.controls = true;

    // Create a source element for the audio file
    const audioSource = document.createElement("source");
    audioSource.src = `{{ url_for('static', filename='${soundTitel}.mp3') }}`;; // Replace with your audio file path
    audioSource.type = "audio/mp3";

    // Append the source element to the audio element
    audioPlayer.appendChild(audioSource);

    // Append the play/pause button and audio player to the audio div
    audioDiv.appendChild(playPauseButton);
    audioDiv.appendChild(audioPlayer);

    // Append the audio div to the list element
    listElement.appendChild(audioDiv);

    // Append the list element to the ordered sound list container
    orderedSoundList.appendChild(listElement);

    audioPlayer.addEventListener("click", async () => {
        if (audioPlayer.paused) {
            audioPlayer.play()
            playPauseButton.src = "../static/assets/Framepause.svg"
        } else {
            audioPlayer.pause()
            playPauseButton.src = "../static/assets/Frameplay.svg"
    
        }
    })
    
}