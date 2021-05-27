const movie = location.hash.replace('#', '');
const header = document.querySelector('#header');
const main = document.querySelector('#main');
const headE = {
	left: header.querySelector('#left'),
	middle: header.querySelector('#middle'),
	right: header.querySelector('#right'),
};
const mainE = {
	left: main.querySelector('#left'),
	right: main.querySelector('#right'),
};

async function fillData() {
	const data = await fetch(`/api/title/${movie}`).then((data) => data.json());
	console.log(data);
	document.querySelector('#json').innerHTML = `<pre>${JSON.stringify(
		data,
		null,
		4
	)}</pre>`;

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
	} = data;

	document.querySelector('#report').addEventListener('click', () => {
		const id = prompt('What is the IMDb ID for this movie?');
		fetch(`/api/wrong/${movie}/${id.length === 0 ? 'null' : id}`);
	});

	document.querySelector('#start-movie').addEventListener('click', () => {
		fetch('/api/openMovie', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				path: data.path,
			}),
		});
	});

	document.querySelector('head').appendChild(
		createElem('link', {
			href: data.image,
			rel: 'shortcut icon',
			type: 'image/x-icon',
		})
	);
	document
		.querySelector('head')
		.appendChild(createElem('title', {}, { innerText: data.title }));

	// Title
	createChild(
		headE.left,
		'h1',
		{},
		{
			innerText: data.title,
			classes: ['title'],
		}
	);

	// Tagline
	if (data.taglines.trim()) {
		createChild(
			headE.left,
			'h2',
			{},
			{
				innerText: data.taglines.trim(),
				classes: ['tagline', 'subtitle'],
			}
		);
	}

	// Rating
	if (data.rating) {
		const rating = createElem('div', {}, { classes: ['center-in'] });
		createChild(
			rating,
			'h1',
			{},
			{
				innerText: '⭐',
				classes: ['rating', 'subtitle', 'star'],
			}
		);
		createChild(
			rating,
			'h1',
			{},
			{
				innerText: data.rating,
				classes: ['rating', 'subtitle'],
			}
		);
		createChild(
			rating,
			'h2',
			{},
			{
				innerText: '/10',
				classes: ['rating', 'small'],
			}
		);
		headE.middle.appendChild(rating);
	}

	// Content Rating
	if (data.contentRating) {
		const contentRating = createElem('div', {}, { classes: ['center-in'] });
		createChild(
			contentRating,
			'h1',
			{},
			{
				innerText: data.contentRating,
				classes: ['content-rating', 'subtitle'],
			}
		);
		headE.middle.appendChild(contentRating);
	}

	// Runtime
	if (data.runtime) {
		createChild(
			headE.right,
			'h1',
			{},
			{
				innerText: data.runtime,
				classes: ['runtime', 'subtitle'],
			}
		);
	}

	// Image
	if (data.image) {
		const imgLink = createElem(
			'a',
			{
				href: data.imdbUrl,
				title: 'Open in IMDb',
				target: '_blank',
			},
			{}
		);
		createChild(
			imgLink,
			'img',
			{
				src: data.image,
				alt: 'Image',
			},
			{
				classes: ['image', 'cover'],
			}
		);
		mainE.left.appendChild(imgLink);
	}

	// Description
	if (data.description) {
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: 'Description',
				classes: ['label'],
			}
		);
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: data.description,
				classes: ['description'],
			}
		);
	}

	// Genres
	if (data.genres) {
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: 'Genres',
				classes: ['label'],
			}
		);
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: data.genres.join(', '),
				classes: ['genres'],
			}
		);
	}

	// Stars
	if (data.stars) {
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: 'Stars',
				classes: ['label'],
			}
		);
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: data.stars.join(', '),
				classes: ['stars'],
			}
		);
	}

	// Release Date
	if (data.releaseDate) {
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: 'Released',
				classes: ['label'],
			}
		);
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: data.releaseDate.rawText,
				classes: ['releaseDate'],
			}
		);
	}

	// Storyline
	if (data.storyline) {
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: 'Storyline',
				classes: ['label'],
			}
		);
		createChild(
			mainE.right,
			'p',
			{},
			{
				innerText: data.storyline,
				classes: ['storyline'],
			}
		);
	}
}

const createElem = (type = '', attributes = {}, extra = {}) => {
	const elem = document.createElement(type);
	Object.entries(attributes).forEach(([k, v]) => {
		elem.setAttribute(k, v);
	});
	if (extra.innerHTML) {
		elem.innerHTML = extra.innerHTML;
	}
	if (extra.innerText) {
		elem.innerText = extra.innerText;
	}
	if (extra.classes) {
		elem.classList.add(...extra.classes);
	}
	return elem;
};

const createChild = (elem, type = '', attributes = {}, extra = {}) => {
	elem.appendChild(createElem(type, attributes, extra));
};

if (movie.match(/.+\/.+/)) {
	fillData();
} else {
	location.hash = '';
	location.pathname = '/';
}
