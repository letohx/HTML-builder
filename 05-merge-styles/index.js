const path = require('path');
const fs = require('fs');
const pathFolderSource = path.join(__dirname, 'styles');
const pathFolderPurpose = path.join(__dirname, 'project-dist');
const pathBundle = path.join(pathFolderPurpose, 'bundle.css');
const writeStream = fs.createWriteStream(pathBundle, 'utf8');

fs.readdir(pathFolderSource, { withFileTypes: true }, (error, files) => {
    if (error) {
        console.log('Folder unread', error.message);
        return;
    }

    files.forEach((file) => {
        const relativePathFile = path.join(pathFolderSource, file.name);
        const fileExtension = path.extname(relativePathFile);

        if (file.isFile && fileExtension === '.css') {
            const readStream = fs.createReadStream(relativePathFile, 'utf8');
            readStream.on('data', (chunk) => writeStream.write(chunk));
        }
    })
});