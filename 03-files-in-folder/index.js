const path = require('path');
const fs = require('fs');
const relativePathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(relativePathFolder, { withFileTypes: true }, (error, files) => {
    if (error) console.error(error);
    files.forEach(file => {
        if (file.isDirectory()) return;
        const relativePathFile = path.join(relativePathFolder, file.name);
        const fileName = path.parse(relativePathFile).name;
        const fileExtension = path.extname(relativePathFile).slice(1);

        fs.stat(relativePathFile, (error, stat) => {
            if (error) console.error(error);
            const fileSizeKb = +stat.size / 1024;
            console.log(`${fileName} - ${fileExtension} - ${fileSizeKb}kb`);
        });
    });
});