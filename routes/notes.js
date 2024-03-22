const notes = require('express').Router();
const {
	readAndAppend,
	readFromFile,
	writeToFile,
} = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const allNotes = require('../db/db.json');

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

	const index = allNotes.findIndex((note) => note.id === id);

	if (index !== -1) {
		allNotes.splice(index, 1);
	} else {
		console.log(`ERROR`);
	}

	writeToFile('./db/db.json', allNotes);
	// fs.writeFile('./db/db.json', JSON.stringify(allNotes), (err) =>
	// 	err ? console.error(err) : console.info(`\nData written to db.json`)
	// );

	const response = {
		status: 'Success',
		body: allNotes,
	};

	res.json(response);
});

module.exports = notes;
