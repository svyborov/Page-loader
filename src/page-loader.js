import axios from 'axios';
import fs from 'fs';
import url from 'url';
import * as _path from 'path';

const fsPromises = fs.promises;

const normilizefileName = (address) => {
  const { host, path } = url.parse(address);
  const fileName = `${host}${path}`.replace(/\W/g, '-');
  return fileName.includes('.html') ? fileName : `${fileName}.html`;
};

const loadPage = (address, pathToSave = '') => {
  const fileName = normilizefileName(address);
  return axios.get(address)
    .then(response => fsPromises.writeFile(_path.resolve(pathToSave, fileName), response.data))
    .catch((error) => {
      throw error;
    });
};

export default loadPage;
