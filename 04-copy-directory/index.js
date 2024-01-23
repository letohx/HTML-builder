const path = require('path');
const fs = require('fs');
const pathFolder = path.join(__dirname, 'files');
const pathFolderCopy = path.join(__dirname, 'files-copy');

(function copyDir() {
    fs.rm(pathFolderCopy, { recursive: true, force: true }, (error) => {
        if (error) {
            console.log('Folder not del', error.message);
            return;
        }

        fs.mkdir(pathFolderCopy, { recursive: true }, (error) => {
            if (error) {
                console.log('Folder not created', error.message);
                return;
            }

            fs.readdir(pathFolder, { withFileTypes: true }, (error, files) => {
                if (error) {
                    console.log('Folder unread', error.message);
                    return;
                }

                files.forEach((file) => {
                    const source = path.join(pathFolder, file.name);
                    const purpose = path.join(pathFolderCopy, file.name);
                    fs.copyFile(source, purpose, error => {
                        if (error) {
                            console.log('Error copying', error.message);
                            return;
                        }
                    });
                })
            });
        });
    });
})();