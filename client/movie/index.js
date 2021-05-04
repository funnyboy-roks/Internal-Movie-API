const movie = location.hash.replace('#', '');
const content = document.querySelector('#content');

async function fillData() {
	const json = await fetch(`/api/title/${movie}`).then((data) => data.json());
	console.log(json);
	content.innerText = JSON.stringify(json, null, 4);

	const {
		title,
		description,
		imdbUrl,
		rating,
		contentRating,
		runtime,
		genres,
		releaseDate,
		image,
		stars,
		storyline,
		taglines,
	} = json;

	document.querySelector('#report').addEventListener('click', () => {
		const id = prompt('What is the IMDb ID for this movie?');
		fetch(`/api/wrong/${movie}/${id.length === 0 ? 'null' : id}`);
	});
}

if (movie.match(/.+\/.+/)) {
	fillData();
} else {
	location.hash = '';
	location.pathname = '/';
}
