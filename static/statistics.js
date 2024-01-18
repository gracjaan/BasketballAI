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

socket.on("stats_data", function ({ score, attempts }) {
	console.log(score, attempts);
	document.getElementById("score").innerText = score;
	document.getElementById("attempts").innerText = attempts;
	document.getElementById("percentage").innerText =
		(attempts === 0 ? 0 : Math.round((score / attempts) * 100)) + "%";
});

// Reload every 10 seconds
setInterval(() => {
	socket.emit("stats", localStorage.getItem("id"));
}, 10000);
socket.emit("stats", localStorage.getItem("id"));
