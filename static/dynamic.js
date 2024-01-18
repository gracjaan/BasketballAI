var socket = io.connect(
	window.location.protocol +
		"//" +
		window.location.hostname +
		":" +
		location.port,
	{
		transports: ["websocket"],
	}
);
socket.on("connect", function () {
	console.log("Connected...!", socket.connected);

	socket.emit("gen_id", localStorage.getItem("id"));
});
socket.on("gen_id", function ({ id }) {
	localStorage.setItem("id", id);
});

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
const video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices
		.getUserMedia({
			video: true,
		})
		.then(function (stream) {
			let { width, height } = stream.getTracks()[0].getSettings();
			video.width = width;
			video.height = height;
			photo.width = width;
			photo.height = height;
			canvas.width = width;
			canvas.height = height;

			video.srcObject = stream;
			video.play();
		})
		.catch(function (err0r) {});
}

const FPS = 4;
setInterval(() => {
	width = video.width;
	height = video.height;
	context.drawImage(video, 0, 0, width, height);
	var data = canvas.toDataURL("image/jpeg", 0.5);
	context.clearRect(0, 0, width, height);
	socket.emit("image", { id: localStorage.getItem("id"), data });
}, 1000 / FPS);

let previous = {
	attempts: 0,
	score: 0,
};
socket.on("processed_image", function ({ data, score, attempts }) {
	if (score > previous.score) {
		playEffect("cheer", 1, { start: 0, duration: 6 });
	} else if (attempts > previous.attempts) {
		playEffect("boo", 1, { start: 0, duration: 7 });
	}

	previous = {
		attempts,
		score,
	};

	photo.setAttribute("src", data);
});

const effects = [
	{
		name: "crowd-long",
		volume: 0.6,
		length: 60 * 60,
		single: true,
	},
	{
		name: "buzzer",
		volume: 1,
		length: 8,
		single: false,
	},
	{
		name: "commentary",
		volume: 0.6,
		length: 8 * 60,
		single: false,
	},
	{
		name: "crowd-short",
		volume: 0.6,
		length: 35,
		single: true,
	},
	{
		name: "swish",
		volume: 1,
		length: 12,
		single: false,
	},
];

async function singleLoop() {
	await playRandom(true);
	singleLoop();
}

async function effectsLoop() {
	await playRandom(false);
	setTimeout(() => effectsLoop(), getRandomInt(60, 5 * 60) * 1000);
}

function playRandom(single = null) {
	const filteredEffects =
		single === null ? effects : effects.filter((x) => x.single === single);
	const effect = filteredEffects[getRandomInt(0, filteredEffects.length - 1)];

	const start = getRandomInt(effect.length / 50, effect.length - 1);
	const duration = getRandomInt(
		Math.min(effect.length, 10),
		effect.length - start
	);

	playEffect(effect.name, effect.volume, {
		start,
		duration,
	});

	return new Promise((resolve) => {
		setTimeout(resolve, duration * 1000);
	});
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playEffect(fileName, volume, { start = 0, duration = -1 } = {}) {
	const audio = new Audio(`/static/effects/${fileName}.mp3`);

	if (duration !== -1) {
		audio.loop = true;
	}

	console.log(fileName, volume, start, duration);
	audio.addEventListener("loadedmetadata", () => {
		audio.currentTime = Math.min(start, audio.duration - 1);
		audio.play();
		adjustVolume(audio, volume);
	});

	let fadeOutTimeout = null;
	let pauseTimeout = null;
	audio.addEventListener("play", () => {
		if (fadeOutTimeout) {
			clearTimeout(fadeOutTimeout);
		}

		fadeOutTimeout = setTimeout(() => {
			adjustVolume(audio, 0);
		}, (duration || audio.duration) * 1000 - 500);

		if (pauseTimeout) {
			clearTimeout(pauseTimeout);
		}

		pauseTimeout = setTimeout(() => {
			audio.pause();
		}, (duration || audio.duration) * 1000);
	});

	audio.addEventListener("ended", () => {
		if (fadeOutTimeout) {
			clearTimeout(fadeOutTimeout);
		}
		if (pauseTimeout) {
			clearTimeout(pauseTimeout);
		}

		audio.remove();
	});
}

async function adjustVolume(
	element,
	newVolume,
	{ duration = 1000, easing = swing, interval = 13 } = {}
) {
	const originalVolume = element.volume;
	const delta = newVolume - originalVolume;

	if (!delta || !duration || !easing || !interval) {
		element.volume = newVolume;
		return Promise.resolve();
	}

	const ticks = Math.floor(duration / interval);
	let tick = 1;

	return new Promise((resolve) => {
		const timer = setInterval(() => {
			element.volume = originalVolume + easing(tick / ticks) * delta;

			if (++tick === ticks + 1) {
				clearInterval(timer);
				resolve();
			}
		}, interval);
	});
}

function swing(p) {
	return 0.5 - Math.cos(p * Math.PI) / 2;
}

singleLoop();
effectsLoop();
