const fs = require("fs");

const readFileContent = (filePath) => {
  return fs.readFileSync(filePath);
};

const writeFileContent = (outputPath, content) => {
  fs.writeFileSync(outputPath, content);
};

module.exports = { readFileContent, writeFileContent };
