const json = require('./data/movies.json');
const fs = require('fs');

const titlesList = {};
let genres = [];
Object.keys(json).forEach((alphaSet) => {
	Object.keys(json[alphaSet]).forEach((key) => {
		const {
			title,
			runtime,
			image,
			genres: mGenres,
			description,
			tagline,
			stars,
			path,
		} = json[alphaSet][key];

		if(!Object.keys(titlesList).includes(alphaSet)) {
			titlesList[alphaSet] = [];
		}

		titlesList[alphaSet].push({
			title,
			runtime,
			image,
			genres: mGenres,
			description,
			tagline,
			stars,
			path,
			alpha: alphaSet,
			url: path.replace(/\\/g, '/'),
		});
		genres.push(...(mGenres || []));
	});
});
genres = [
	...new Set(
		genres.filter(
			(g) =>
				!(
					g.includes('TV') ||
					g.includes('Episode') ||
					g.includes('Video') ||
					g.includes('IMDbPro') ||
					g.length === 0 ||
					g.match(/^\d+.*/)
				)
		)
	),
];

const getTitle = (alpha, name) => {
	if (!json[alpha]) return null;

	return json[alpha][name] || null;
};

const badMovie = (name, id) => {
	const json = JSON.parse(fs.readFileSync('./server/data/update.json', 'utf-8'));
	json.push({
		name: name,
		imdb_id: id,
	});
	fs.writeFileSync('./server/data/update.json', JSON.stringify(json, null, 4), 'utf-8');
}

module.exports = { titlesList, getTitle, genres, badMovie };
