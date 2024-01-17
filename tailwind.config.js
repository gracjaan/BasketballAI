/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./templates/**/*.html", "./static/**/*.js"],
	theme: {
		extend: {
			colors: {
				primary: "#d9d9d9",
				secondary: "#bfbfbf",
			},
			fontFamily: {
				montserrat: ["Montserrat"],
				lato: ["Lato"],
				garamond: ["Garamond"],
			},
		},
	},
	plugins: [],
};
