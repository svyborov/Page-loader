import axios from 'axios';
import fs from 'fs';
import url from 'url';
import path from 'path';
import cheerio from 'cheerio';

const fsPromises = fs.promises;

const normilizefileName = (address) => {
  const { hostname, pathname } = url.parse(address);
  const fileName = `${hostname}${pathname}`.replace(/\W/g, '-');
  return fileName.includes('.html') ? fileName : `${fileName}.html`;
};

const loadPage = (address, pathToSave = '') => {
  const fileName = normilizefileName(address);
  axios.defaults.host = url.parse(address).host;
  let res;
  return axios.get(address)
    .then((response) => {
      fsPromises.writeFile(path.resolve(pathToSave, fileName), response.data);
      res = response;
    })
    .then(() => {
      const $ = cheerio.load(res.data);
      const tags = $('script, link, img');
      console.log(tags);
    })
    .catch((error) => {
      throw error;
    });
};

export default loadPage;
// link, script и img
