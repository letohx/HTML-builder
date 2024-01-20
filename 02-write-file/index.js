const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const relativePathFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(relativePathFile, 'utf8');
const readLine = require('readline').createInterface(stdin);

stdout.write('Enter the text to be added to file ( text.txt ) in the ( 02-write-file ) directory:\n');

readLine.on('line', (input) => {
  const text = `${input}`;
  text.trim() === 'exit' ? exit() : writeStream.write(`${text}\n`);
})

process.on('exit', () => stdout.write('See you again!'));
process.on('SIGINT', exit);