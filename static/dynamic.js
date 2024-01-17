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

const FPS = 8;
setInterval(() => {
	width = video.width;
	height = video.height;
	context.drawImage(video, 0, 0, width, height);
	var data = canvas.toDataURL("image/jpeg", 0.5);
	context.clearRect(0, 0, width, height);
	socket.emit("image", data);
}, 1000 / FPS);

socket.on("processed_image", function ({ data, score, attempts }) {
	console.log(score, attempts);
	photo.setAttribute("src", data);
});
