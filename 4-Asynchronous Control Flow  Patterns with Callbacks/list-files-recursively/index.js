/* 
Problem:
  List files recursively: Write listNestedFiles(), a callback-style function 
  that takes, as the input, the path to a directory in the local filesystem and that 
  asynchronously iterates over all the subdirectories to eventually return a list 
  of all the files discovered. Here is what the signature of the function should 
  look like:
    function listNestedFiles (dir, cb) { ... }
*/
import * as fs from 'fs';
import * as path from 'path';

function listNestedFiles(dir, cb) {
	// to check if the directory exists

	// read directory
	fs.readdir(dir, (err, files) => {
		if (err) return cb(err);
		if (files.length === 0) return cb(null, null);

		// if there are directories inside call the ListNestedFiles again
		const directories = files.filter((file) => !file.includes('.'));

		for (const directory of directories) {
			listNestedFiles(path.join(dir, directory), cb);
		}

		// if there are files console.log them
		const filesFound = files.filter((file) => file.includes('.'));
		cb(null, filesFound);
	});
}

listNestedFiles('target-dir', (err, data) => {
	if (err) {
		return console.log(err.message);
	}

	if (data) {
		console.log('Files Found:', data);
	}
});
