const notes = require('express').Router();
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

notes.get('/', (req, res) => {
	readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
	const { title, text } = req.body;

	if (title && text) {
		const newNote = {
			title,
			text,
			id: uuidv4(),
		};

		readAndAppend(newNote, './db/db.json');

		const response = {
			status: 'success',
			body: newNote,
		};

		res.json(response);
	} else {
		res.json('Error in posting note');
	}
});

notes.delete('/:id', (req, res) => {
	const { id } = req.params;

	fs.readFile('./db/db.json', 'utf8', (error, data) => {
		if (error) {
			throw error;
		} else {
			const dbData = JSON.parse(data);

			const index = dbData.findIndex((note) => note.id === id);

			if (index !== -1) {
				dbData.splice(index, 1);
			} else {
				console.log(`IT DELETED THE WHOLE LIST`);
			}

			fs.writeFile('./db/db.json', JSON.stringify(dbData), (err) =>
				err ? console.error(err) : console.info(`\nData written to db.json`)
			);

			const response = {
				status: 'Success',
			};

			res.json(response);
		}
	});
});

module.exports = notes;
