const elems = {
	searchBar: document.querySelector('#search'),
	alpha: document.querySelector('#alpha'),
	genre: document.querySelector('#genre'),
	movieList: document.querySelector('#movie-list'),
};

let titles;
let genres;
const allMovies = [];

let lastSearchValue = '';

const runPage = async () => {
	titles = await fetch('/api/titles').then((r) => r.json());
	genres = await fetch('/api/genres').then((r) => r.json());

	Object.values(titles).forEach((v) => {
		allMovies.push(...v);
	});

	Object.keys(titles).forEach((k) => {
		const elem = document.createElement('option');
		elem.value = k;
		elem.innerText = k;
		elems.alpha.appendChild(elem);
	});

	genres.forEach((k) => {
		const elem = document.createElement('option');
		elem.value = k;
		elem.innerText = k;
		elems.genre.appendChild(elem);
	});

	elems.alpha.addEventListener('input', filter);
	elems.genre.addEventListener('input', filter);

	setInterval(() => {
		if (lastSearchValue != elems.searchBar.value) {
			lastSearchValue = elems.searchBar.value;
			filter();
		}
	}, 1000);
	filter();

	showTitles();
};

const filter = () => {
	let show = allMovies;

	if (elems.alpha.value != 'all') {
		show = titles[elems.alpha.value]; // Sort by alphabet
	}

	if (elems.genre.value != 'all') {
		show = show.filter((m) => (m.genres || []).includes(elems.genre.value)); // Sort by Genre
	}

	const filterRegEx = /[\s,_-]+/g;
	if (lastSearchValue != '') {
		const filterValue = lastSearchValue
			.toLowerCase()
			.replace(filterRegEx, '-');
		show = show.filter(
			(m) =>
				(m.title || '')
					.replace(filterRegEx, '-') // Make whitespace, commas, underscores, and dashes the same - this also makes "one, two" and "one two" the same
					.toLowerCase()
					.includes(filterValue) ||
				anyInclude(
					(m.stars || []).map((v) =>
						v.toLowerCase().replace(filterRegEx, '-')
					),
					filterValue
				)
		);
	}

	showTitles(show.length === 0 ? false : show);
};

const showTitles = (movies = allMovies) => {
	elems.movieList.innerHTML = '';
	if (!movies) {
		elems.movieList.innerHTML = `<h1>No results found.</h1>`;
		return;
	}
	if (movies.length === 0) {
		movies = allMovies;
	}
	movies.forEach((t) => {
		const elem = document.createElement('div');
		elem.classList.add('card');
		elem.setAttribute('title', 'Click to view');
		elem.addEventListener('click', () => {
			window.location.hash = t.url;
			window.location.pathname = '/movie/';
		});

		const title = document.createElement('h1');
		title.innerText = t.title;
		elem.appendChild(title);

		const genres = document.createElement('p');
		genres.innerText = (t.genres || []).join(', ');
		elem.appendChild(genres);

		const stars = document.createElement('p');
		stars.innerText = (t.stars || []).join(', ');
		elem.appendChild(stars);

		const image = document.createElement('img');
		image.setAttribute('src', t.image);
		elem.appendChild(image);

		elems.movieList.appendChild(elem);
	});
};

const anyInclude = (arr = [], v = '') => {
	for (const a of arr) {
		if (a.includes(v)) return true;
	}
	return false;
};

window.location.hash = '';
window.onload = runPage;
