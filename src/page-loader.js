import axios from 'axios';
// import httpAdapter from 'axios/lib/adapters/http';
import fs from 'fs';
import url from 'url';

// axios.defaults.adapter = httpAdapter;
const fsPromises = fs.promises;

const normilizefileName = (address) => {
  const { host, path } = url.parse(address);
  const fileName = `${host}${path}`.replace(/\W/g, '-');
  return fileName.includes('.html') ? fileName : `${fileName}.html`;
};

const pageLoader = (path = '', address) => {
  const fileName = normilizefileName(address);
  return axios.get(address)
    .then((response) => {
      // console.log(response.data);
      fsPromises.writeFile(`${path}${fileName}`, response.data);
      return `${path}${fileName}`;
    })
    .catch(error => console.log(error));
};

export default pageLoader;
