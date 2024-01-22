const path = require('path');
const fs = require('fs');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathTemplateHtml = path.join(__dirname, 'template.html');
const pathPurposeHtml = path.join(pathProjectDist, 'index.html');
const pathFolderSourceCss = path.join(__dirname, 'styles');
const pathPurposeCss = path.join(pathProjectDist, 'style.css');
const pathFolderSourceAssets = path.join(__dirname, 'assets');
const pathFolderPurposeAssets = path.join(pathProjectDist, 'assets');
const pathFolderComponents = path.join(__dirname, 'components');
const stdout = process.stdout;

(function createFolders() {
    fs.rm(pathProjectDist, { recursive: true, force: true }, (error) => {
        if (error) {
            console.log('Folder not del', error.message);
            return;
        }
        fs.mkdir(pathProjectDist, { recursive: true }, (error) => {
            if (error) {
                console.log('Folder not created', error.message);
                return;
            }
        });
        fs.mkdir(pathFolderPurposeAssets, { recursive: true }, (error) => {
            if (error) {
                console.log('Folder not created', error.message);
                return;
            }

            fs.readdir(pathFolderSourceAssets, { withFileTypes: true }, (error, filesArr) => {
                (function copyAssets(filesArr, index, relativeDir) {
                    const file = filesArr[index];

                    if(filesArr.length === index) return;
                        if (file.isDirectory()) {
                            const relativePath = path.join(pathFolderSourceAssets, relativeDir, file.name);

                            fs.readdir(relativePath, { withFileTypes: true }, (error, filesArr) => {
                                if (error) {
                                    console.log('Folder unread', error.message);
                                    return;
                                }

                                const relativePath = path.join(pathFolderPurposeAssets, relativeDir, file.name);
                                fs.mkdir(relativePath, { recursive: true }, (error) => {
                                    if (error) {
                                        console.log('Folder not created', error.message);
                                        return;
                                    }
                                    const newRelativeDir = path.join(relativeDir, file.name);
                                    copyAssets(filesArr, 0, newRelativeDir);
                                });
                            });
                        } else {
                            const source = path.join(pathFolderSourceAssets, relativeDir, file.name);
                            const purpose = path.join(pathFolderPurposeAssets, relativeDir, file.name);
                            fs.copyFile(source, purpose, error => {
                                if (error) {
                                    console.log('Error copying', error.message);
                                    return;
                                }
                            });
                        }
                        copyAssets(filesArr, index + 1, relativeDir);
                })(filesArr, 0, '');
            });

            createMergeCss();
            createHtml();
        });
    });
})();

function createMergeCss() {
    const writeStream = fs.createWriteStream(pathPurposeCss, 'utf8');
    fs.readdir(pathFolderSourceCss, { withFileTypes: true }, (error, files) => {
        if (error) {
            console.log('Folder unread', error.message);
            return;
        }

        files.forEach((file) => {
            const relativePathFile = path.join(pathFolderSourceCss, file.name);
            const fileExtension = path.extname(relativePathFile);

            if (file.isFile() && fileExtension === '.css') {
                const readStream = fs.createReadStream(relativePathFile, 'utf8');
                readStream.on('data', (chunk) => writeStream.write(chunk));
            }
        })
    });
};

function createHtml() {
    fs.readFile(pathTemplateHtml, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading template HTML:', err.message);
            return;
        }

        fs.readdir(pathFolderComponents, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.error('Error reading components folder:', err.message);
                return;
            }

            const htmlFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.html');
            let filesProcessed = 0;

            if (htmlFiles.length === 0) {
                writeFile(data);
            }

            htmlFiles.forEach(file => {
                const componentName = file.name.split('.')[0];
                if (data.includes(componentName)) {
                    fs.readFile(path.join(pathFolderComponents, file.name), 'utf8', (err, fileData) => {
                        if (err) {
                            console.error(`Error reading component ${file.name}:`, err.message);
                            return;
                        }

                        const delComponent = `{{${componentName}}}`;
                        data = data.replaceAll(delComponent, fileData);

                        filesProcessed++;
                        if (filesProcessed === htmlFiles.length) {
                            writeFile(data);
                        }
                    });
                } else {
                    filesProcessed++;
                    if (filesProcessed === htmlFiles.length) {
                        writeFile(data);
                    }
                }
            });
        });
    });
}

function writeFile(data) {
    fs.writeFile(pathPurposeHtml, data, (err) => {
        if (err) {
            console.error('Error writing final HTML file:', err.message);
            return;
        }
        console.log('HTML file written successfully');
    });
}