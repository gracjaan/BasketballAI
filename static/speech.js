const parentDiv = document.getElementById("speech-overlay");
const outputDiv = document.getElementById("speech-output");
const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
let recognizingTimer = -1;

recognition.interimResults = true;
recognition.continuous = true;

recognition.onresult = (event) => {
	const result = event.results[event.results.length - 1][0].transcript.trim();
	outputDiv.textContent = result;

	if (result.length < 1) {
		return;
	}

	parentDiv.classList.remove("opacity-0");
	parentDiv.classList.remove("invisible");
	if (recognizingTimer !== -1) {
		clearTimeout(recognizingTimer);
	}
	recognizingTimer = setTimeout(() => {
		parentDiv.classList.add("opacity-0");
		setTimeout(() => {
			parentDiv.classList.add("invisible");
		}, 200);
	}, 2000);

	if (
		event.results[event.results.length - 1].isFinal &&
		result.startsWith("scenari")
	) {
		const [_, ...scenario] = result.split(" ");
		if (scenario.length === 0) {
			return;
		}

		window.location.href =
			"/?scenario=" +
			scenario.filter((x) => x.toLowerCase() !== "play").join(" ");
	}
};

recognition.onend = () => {};

recognition.onerror = (event) => {
	console.error("Speech recognition error:", event.error);
};

recognition.onnomatch = () => {
	console.log("No speech was recognized.");
};

recognition.start();
