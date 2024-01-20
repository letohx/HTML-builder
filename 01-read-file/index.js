const path = require('path');
const fs = require('fs');
const stdout = process.stdout;
const relativePathFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(relativePathFile, 'utf8');
let data = '';

readStream.on('data', (chunk) => data = `${data}${chunk}`);
readStream.on('end', () => stdout.write(data));
readStream.on("error", (error) => stdout.write(error.message));