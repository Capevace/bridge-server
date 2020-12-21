const fs = require('fs');
const path = require('path');

const Router = require('express').Router;
const app = new Router();

const DOCS_PATH = path.resolve(__dirname, '../../resources/docs.html');

app.get('/', (req, res) => {
	res.type('text/html').send(fs.readFileSync(DOCS_PATH));
});

module.exports = app;