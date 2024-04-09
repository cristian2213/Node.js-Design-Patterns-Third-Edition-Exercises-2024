/* 
Problem:
	Write the implementation of concatFiles(), a 
	callback-style function that takes two or more paths to text files in the 
	filesystem and a destination file.

	This function must copy the contents of every source file into the destination 
	file, respecting the order of the files, as provided by the arguments list. 
	For instance, given two files, if the first file contains foo and the second 
	file contains bar, the function should write foobar (and not barfoo) in the 
	destination file.
*/

import * as fs from 'fs';

function concatFilesAsync(dest, cb, ...srcFiles) {
	// to check at least one file in the list
	if (!Array.isArray(srcFiles) && srcFiles.length === 0)
		return cb('No file path was given');

	// to clean repeated files
	const srcFilesSet = new Set(...srcFiles);

	// to check all files are text files
	const isLastFile = (file) => {
		const lastFile = Array.from(srcFilesSet).pop();
		return file === lastFile;
	};

	const errors = new Map();
	for (const file of srcFilesSet) {
		fs.readFile(file, { encoding: 'utf-8' }, (err, content) => {
			if ((err && err.code === 'ENOENT') || !file.endsWith('.txt')) {
				return errors.set(file, err?.message ?? 'Only .txt files are allowed');
			}

			// to write the file
			fs.appendFile(dest, content, { encoding: 'utf-8', flag: 'a' }, (err2) => {
				if (err2) {
					return errors.set(file, err2.message);
				}

				cb(null, {
					currentFile: `${file} processed`,
					errors: isLastFile(file) ? errors : null,
				});
			});
		});
	}
}

concatFilesAsync(
	'all.txt',
	(err, data) => {
		if (err) return console.log(err);

		const { currentFile, errors } = data;
		console.log(currentFile);

		if (errors) {
			// all files were processed
			console.log('errors', errors);
		}
	},
	['text1.txt', 'text.js', 'text2.txt']
);
