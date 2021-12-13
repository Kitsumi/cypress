const Markov = require("./markov.js");
const removeDiacritics = require("./diacritics.js");
const fs = require('fs');
var db = {};

try {
	let data = fs.readFileSync("./memory.json", "utf8");
	db = JSON.parse(data);
	console.log("Loaded memory file.");
} catch (e) {
	console.log("Memory file dead.");
}

let badResponses = [
	"i dont understand",
	"im unfamiliar with those words",
	"what was that",
	"im confused",
	"what",
	"im not sure that makes sense"
];

let lastMessage = "hello";
function getResponse(string) {
	let cleaned = removeDiacritics(string).toLowerCase().match(/([\w\d\s]+|\<\@\![\d]+\>|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi);
	
	if (cleaned && cleaned.length < 1) {
		lastMessage = badResponses[Math.floor(Math.random() * badResponses.length)];
		return lastMessage;
	}
	
	cleaned = cleaned.join("");
	
	let splitMessage = lastMessage.split(" ");
	
	for (var i = 0; i < splitMessage.length; i++) {
		let word = splitMessage[i];
		if (!db.hasOwnProperty(word)) {
			db[word] = [];
		}
		
		db[word].push(cleaned);
	}
	
	fs.writeFileSync("./memory.json", JSON.stringify(db, null, 4), "utf8");
	
	let words = cleaned.split(" ");
	let dictionary = [];
	
	for (var i = 0; i < words.length; i++) {
		let word = words[i];
		if (db.hasOwnProperty(word)) {
			dictionary = dictionary.concat(db[word]);
		}
	}
	
	if (dictionary.length < 1) {
		lastMessage = badResponses[Math.floor(Math.random() * badResponses.length)];
	} else {
		lastMessage = Markov(Math.floor(Math.random() * 10) + 5, dictionary);
	}
	
	return lastMessage;
}

module.exports = {
	getResponse: getResponse
};