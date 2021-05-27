const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dataHandler = require('./dataHandler');
const https = require('https');
const fs = require('fs');
const wol = require('wol');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
https // Use an HTTPS connection with a self-signed cert
	.createServer(
		{
			key: fs.readFileSync('ex.key'),
			cert: fs.readFileSync('ex.crt'),
		},
		app
	)
	.listen(port, null, () => {
		console.log(`Listening at https://localhost:${port}`);
	});

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ['*'],
			scriptSrc: ["'self'"],
			imgSrc: ['*'],
		},
	})
);
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./client'));

app.get('/api/title/:alpha/:name', (req, res) => {
	const { alpha, name } = req.params;

	const movieInfo = dataHandler.getTitle(alpha, name);

	if (movieInfo) {
		res.json(movieInfo);
	} else {
		res.status(404);
	}
});

app.get('/api/titles', (req, res) => {
	res.json(dataHandler.titlesList);
});

app.get('/api/genres', (req, res) => {
	res.json(dataHandler.genres);
});

app.get('/api/wrong/:alpha/:name/:id', (req, res) => {
	const { alpha, name, id } = req.params;

	dataHandler.badMovie(alpha + '\\' + name, id);

	res.json({ message: 'submitted' });
});

app.post('/api/wakeNAS', (req, res) => {
	console.log('Starting NAS...');
	wol.wake(process.env.NAS_MAC);
	res.end();
});

app.post('/api/openMovie', (req, res) => {
	fetch(`http://${process.env.MOVIE_PC_IP}:${process.env.MOVIE_PC_PORT}/api/openMovie`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(req.body),
	});
	res.end();
});

// app.listen(port, () => {
// 	console.log(`Listening at http://localhost:${port}`);
// });
