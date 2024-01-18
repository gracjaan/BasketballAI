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
	if (!(await hasInteracted())) {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.catch(() => {});

		showInteractionOverlay();
	}
})();
