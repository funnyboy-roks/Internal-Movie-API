const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dataHandler = require('./dataHandler');
const https = require('https');
const fs = require('fs');
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
	.listen(port);

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

app.get('/api/wrong/:name/:id', (req, res) => {
	const { name, id } = req.params;

	dataHandler.badMovie(name, id);

	res.json({ message: 'submitted' });
});

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
// 	console.log(`Listening at http://localhost:${port}`);
// });
