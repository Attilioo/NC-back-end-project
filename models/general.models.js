const fs = require("fs/promises");
exports.selectAPI = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`).then((response) => {
    return JSON.parse(response);
  });
};
