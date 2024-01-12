async function insertSounds() {
	const files = ["buzzer", "commentary", "swish"];
	console.log(files);
	for (let i = 0; i < files.length; i++) {
		const fileName = files[i];
		generateSoundList(fileName);
	}
}

function playSound(source) {
	if (source.paused) {
		source.play();
	} else {
		source.pause();
	}
}

function generateSoundList(soundTitel) {
	const orderedSoundList = document.getElementById("soundList");

	const listElement = document.createElement("li");
	listElement.classList.add(
		"flex",
		"items-center",
		"justify-between",
		"bg-primary",
		"rounded-xl",
		"py-2",
		"px-4"
	);

	const titleDiv = document.createElement("div");
	const titlePara = document.createElement("p");
	titlePara.classList.add("font-bold");
	titlePara.innerText = soundTitel;
	titleDiv.appendChild(titlePara);
	listElement.appendChild(titleDiv);

	const audioDiv = document.createElement("div");
	audioDiv.classList.add("rounded-xl");

	// Create an image for the play/pause button
	const playPauseButton = document.createElement("img");
	playPauseButton.id = "playPause";
	playPauseButton.src = "../static/assets/Frameplay.svg";
	playPauseButton.alt = "playButton";

	// Create an audio element
	const audioPlayer = document.createElement("audio");
	audioPlayer.classList.add("hidden");
	audioPlayer.id = "audioPlayer";
	audioPlayer.controls = true;
	audioPlayer.addEventListener("pause", () => {
		playPauseButton.src = "../static/assets/Frameplay.svg";
	});
	audioPlayer.addEventListener("play", () => {
		playPauseButton.src = "../static/assets/Framepause.svg";
	});
	playPauseButton.onclick = playSound.bind(null, audioPlayer);

	// Create a source element for the audio file
	const audioSource = document.createElement("source");
	audioSource.src = `/static/sounds/${soundTitel}.mp3`; // Replace with your audio file path
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
}

insertSounds();
