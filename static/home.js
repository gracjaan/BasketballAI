const files = ["finals 2016", "finals 2023", "kobe bryant", "michael jordan"];
async function insertSounds() {
	console.log(files);
	for (let i = 0; i < files.length; i++) {
		const fileName = files[i];
		generateSoundList(fileName);
	}

	if (new URLSearchParams(window.location.search).has("scenario")) {
		const scenario = new URLSearchParams(window.location.search).get(
			"scenario"
		);

		if (scenario.toLowerCase().startsWith("dynamic")) {
			window.location.href = "/dynamic";
		} else if (scenario.toLowerCase().startsWith("statist")) {
			window.location.href = "/statistics";
		} else {
			playFromVoice(scenario.toLowerCase());
		}
	}
}

function playFromVoice(scenario) {
	let selectedFile = null;
	for (const file of files) {
		if (scenario.startsWith(file.substring(0, 10))) {
			selectedFile = file;
			break;
		}
	}

	if (selectedFile !== null) {
		const audioPlayer = document.getElementById(
			"audioPlayer-" + selectedFile
		);
		playEffect(audioPlayer);
	}
}

function playEffect(source) {
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
		"py-4",
		"px-4"
	);

	const titleDiv = document.createElement("div");
	const titlePara = document.createElement("p");
	titlePara.classList.add("font-bold", "capitalize");
	titlePara.innerText = soundTitel;
	titleDiv.appendChild(titlePara);
	listElement.appendChild(titleDiv);

	const audioDiv = document.createElement("div");
	audioDiv.classList.add("rounded-xl");

	// Create an image for the play/pause button
	const playPauseButton = document.createElement("img");
	playPauseButton.classList.add("w-8", "h-8");
	playPauseButton.id = "playPause-" + soundTitel;
	playPauseButton.src = "../static/assets/Frameplay.svg";
	playPauseButton.alt = "playButton";

	// Create an audio element
	const audioPlayer = document.createElement("audio");
	audioPlayer.classList.add("hidden");
	audioPlayer.id = "audioPlayer-" + soundTitel;
	audioPlayer.controls = true;
	audioPlayer.addEventListener("pause", () => {
		playPauseButton.src = "../static/assets/Frameplay.svg";
	});
	audioPlayer.addEventListener("play", () => {
		playPauseButton.src = "../static/assets/Framepause.svg";
	});
	playPauseButton.onclick = playEffect.bind(null, audioPlayer);

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

const hasInteracted = () => {
	const audio = new Audio("/static/effects/swish.mp3");
	audio.muted = true;
	return audio
		.play()
		.then(() => true)
		.catch(() => false);
};

function hideInteractionOverlay() {
	const interactionDiv = document.getElementById("interaction-overlay");
	interactionDiv.classList.add("opacity-0");
	setTimeout(() => {
		interactionDiv.classList.add("invisible");
	}, 200);

	window.location.reload();
}

function showInteractionOverlay() {
	const interactionDiv = document.getElementById("interaction-overlay");
	interactionDiv.classList.remove("opacity-0");
	interactionDiv.classList.remove("invisible");
}

(async () => {
	insertSounds();

	if (!(await hasInteracted())) {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.catch(() => {});

		showInteractionOverlay();
	}
})();
