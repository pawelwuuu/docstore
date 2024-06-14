const fs = require('fs')
const path = require('node:path');

const outputDir = path.join(__dirname, '..', '..', 'data')

const appendToFile = async (str, filename) => {
   await fs.appendFile(path.join(outputDir, filename), str, (err) => {
      if (err) {
         console.log(err)
      }
   })
}

const moveFile = async (from, to) => {
    await fs.rename(from, to, (err) => {
       console.log(err);
    });
}

module.exports = {appendToFile, moveFile}