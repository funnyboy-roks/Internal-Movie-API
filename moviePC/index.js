const express = require('express');
const morgan = require('morgan');
const childProcess = require('child_process');
require('dotenv').config();

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/api/openMovie', (req, res) => {
	const path = process.env.PATH_PREFIX + req.body.path;
	childProcess.exec(`notify-send "${path}"`); // TODO: Find the correct command (can't remember off the top of my head)
    res.end();
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Listening at localhost:${port}`);
});
