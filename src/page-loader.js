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
      const elemsWithAssets = $('script, link, img');
      console.log(elemsWithAssets);
      const scripts = $('body');
      console.log(scripts);
      const fruits = [];
      const needTags = scripts.filter((i, el) => {
        // this === el
        console.log(el);
        return $(el).attr('class') === 'orange';
      });
      console.log(needTags);
      /*
      scripts.each((i, elem) => {
        fruits[i] = $(elem).attr('src');
      }); */
      console.log(fruits);
    })
    .catch((error) => {
      throw error;
    });
};

export default loadPage;
// link, script и img
