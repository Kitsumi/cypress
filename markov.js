// Originally from https://www.soliantconsulting.com/blog/title-generator-using-markov-chains/

function markov(length, arr) {
	var terminals = {};
	var startwords = [];
	var wordstats = {};

	for (var i = 0; i < arr.length; i++) {
		var words = arr[i].split(' ');
		terminals[words[words.length-1]] = true;
		startwords.push(words[0]);
		for (var j = 0; j < words.length - 1; j++) {
			if (wordstats.hasOwnProperty(words[j])) {
				wordstats[words[j]].push(words[j+1]);
			} else {
				wordstats[words[j]] = [words[j+1]];
			}
		}
	}

	var choice = function (a) {
		var i = Math.floor(a.length * Math.random());
		return a[i];
	};

	var make_title = function (min_length, count) {
		word = choice(startwords);
		var title = [word];
		while (wordstats.hasOwnProperty(word)) {
			var next_words = wordstats[word];
			word = choice(next_words);
			title.push(word);
			if (title.length > min_length && terminals.hasOwnProperty(word)) break;
		}
		if (title.length < min_length && count < 20) return make_title(min_length, count + 1);
		return title.join(' ');
	};
	
	return make_title(length);
}

module.exports = markov;