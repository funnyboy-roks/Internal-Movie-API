const movie = location.hash.replace('#', '');
const content = document.querySelector('#content');

console.log('test');

const [alpha, title] = movie.split('/');

async function fillData() {
	const data = await fetch(`/api/title/${movie}`);
	const json = await data.json();
	console.log(json);
	content.innerText = JSON.stringify(json, null, 4);
}

if (movie.match(/.*\/.*/)) {
	fillData();
} else {
	console.error('Invalid Movie');
}

document.querySelector('#report').addEventListener('click', () => {
	const id = prompt('What is the IMDb ID for this movie?');
	fetch(`/api/wrong/${title}/${id.length === 0 ? 'null' : id}`);
});
