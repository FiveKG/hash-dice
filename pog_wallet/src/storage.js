const readFile = () => {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(dirEntry) {
            dirEntry.getFile('wallet.json', { create: true }, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        console.log("Succe ssful file read: " + this.result);
                        resolve(JSON.parse(this.result))
                    };
                    reader.readAsText(file);
                }, function(err) {
                    console.log('readFile', err)
                    resolve(null)
                });
            })
        }, function(err) {
            console.log('readFile', err)
            resolve(null)
        })
    })
}

const writeFile = (data) => {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(dirEntry) {
            dirEntry.getFile('wallet.json', { create: true }, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function() {
                        console.log("Successful file write...");
                        readFile().then(res => {
                            resolve(res)
                        })
                    };

                    fileWriter.onerror = function(e) {
                        console.log("Failed file write: " + e.toString());
                        reject(e)
                    };

                    fileWriter.write(JSON.stringify(data));
                });
            })
        }, function(err) {
            console.log('writeFile', err)
            reject(err)
        })
    })
}

export {
    readFile,
    writeFile
}