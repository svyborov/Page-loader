import axios from 'axios';
import fs from 'fs';
import url from 'url';
import path from 'path';
import cheerio from 'cheerio';

const fsPromises = fs.promises;

const tagsTypes = {
  script: 'src',
  link: 'href',
  img: 'src',
};

const normilizefileName = (address) => {
  let ext = path.extname(address);
  const { hostname, pathname } = url.parse(address);
  if (!ext) {
    ext = '.html';
  }
  const fileName = `${hostname || ''}${pathname}`.replace(ext, '').replace(/\W/g, '-');
  return { fileName: `${fileName}${ext}`, pathToSourceFiles: `${fileName}_files` };
};

const loadPage = (address, pathToSave = '') => {
  const { fileName, pathToSourceFiles } = normilizefileName(address);
  const { host } = url.parse(address);
  axios.defaults.host = host;
  let res;
  let $;
  return axios.get(address)
    .then((response) => {
      res = response;
    })
    .then(() => fsPromises.mkdir(path.resolve(pathToSave, pathToSourceFiles)))
    .then(() => {
      $ = cheerio.load(res.data);
      const tags = $('script[src^="/"], link[href^="/"], img[src^="/"]');
      return tags.each((i, el) => {
        const lin = $(el).attr(tagsTypes[el.name]);
        const localAdress = new URL(lin, address).href;
        const localFileName = normilizefileName(lin).fileName.slice(1);
        const newPath = path.join(pathToSourceFiles, localFileName);
        $(el).attr(tagsTypes[el.name], newPath);
        return axios.get(localAdress)
          .then(response => fsPromises.writeFile(path.resolve(pathToSave, newPath), response.data));
      });
    })
    .then(() => fsPromises.writeFile(path.resolve(pathToSave, fileName), $.html()))
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export default loadPage;
