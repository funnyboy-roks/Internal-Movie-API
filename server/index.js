const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dataHandler = require('./dataHandler');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./client'));

app.get('/api', (req, res) => {
	res.json({
		message: 'test',
	});
});

app.get('/api/title/:alpha/:name', (req, res) => {
	const { alpha, name } = req.params;

	const movieInfo = dataHandler.getTitle(alpha, name);

	if(movieInfo) {
		res.json(movieInfo);
	} else {
		res.status(404);
	}
});

app.get('/api/titles', (req, res) => {
	res.json(dataHandler.titlesList);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
