/* 
Problem:
  Write recursiveFind(), a callback-style function that 
  takes a path to a directory in the local filesystem and a keyword, as per the 
  following signature:
  function recursiveFind(dir, keyword, cb) { ... }
  
  The function must find all the text files within the given directory that 
  contain the given keyword in the file contents. The list of matching files 
  should be returned using the callback when the search is completed. If no 
  matching file is found, the callback must be invoked with an empty array. 
  As an example test case, if you have the files foo.txt, bar.txt, and baz.txt
  in myDir and the keyword 'batman' is contained in the files foo.txt and baz.
  txt, you should be able to run the following code:

  recursiveFind('myDir', 'batman', console.log)
  // should print ['foo.txt', 'baz.txt']

  - Bonus points if you make the search recursive (it looks for text files in any 
  subdirectory as well). ✅
	- Extra bonus points if you manage to perform the 
  search within different files and subdirectories in parallel (✅), but be careful to 
  keep the number of parallel tasks under control! 
*/
import * as fs from 'fs';
import * as path from 'path';

let filesFound = [];
let totalFilesFound = 0;
let processesDone = 0;

function recursiveFind(dir, keyword, cb) {
	fs.readdir(dir, (err, files) => {
		if (err) return cb(err);

		// if there are directories inside call the recursiveFind again
		const directories = files.filter((file) => !file.includes('.'));
		for (const directory of directories) {
			recursiveFind(path.join(dir, directory), keyword, cb);
		}

		// if there are text files read there content
		const filesFound = files.filter((file) => file.endsWith('.txt'));
		totalFilesFound += filesFound.length;

		for (const file of filesFound) {
			const targetFile = path.join(dir, file);
			fs.readFile(
				targetFile,
				{
					encoding: 'utf-8',
				},
				(fileReadingError, content) => {
					if (fileReadingError) return cb(fileReadingError);

					// check if the file does not contain the keyword
					if (!content.includes(keyword)) return cb(null, []);

					// it contains the keyword
					cb(null, targetFile);
				}
			);
		}
	});
}

recursiveFind(
	path.join(process.cwd(), 'target-dir'),
	'javascript',
	(error, matchingFile) => {
		if (error) return console.log(error);

		if (matchingFile || !Array.isArray(matchingFile)) {
			filesFound.push(matchingFile);
			processesDone += 1;
		}

		if (totalFilesFound === processesDone) {
			console.log('files found:');
			console.log(filesFound.join('\n'));

			// reset global values
			filesFound = [];
			totalFilesFound = 0;
			processesDone = 0;
		}
	}
);
