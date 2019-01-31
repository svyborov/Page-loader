import axios from 'axios';
import fs from 'fs';
import url from 'url';
import path from 'path';
import cheerio from 'cheerio';
import debug from 'debug';

const loadDebug = debug('page-loader');

const fsPromises = fs.promises;

const tagsTypes = {
  script: 'src',
  link: 'href',
  img: 'src',
};

const resTypes = {
  js: 'text',
  css: 'text',
  html: 'text',
  png: 'stream',
  jpg: 'stream',
};

const normilizefileName = (address) => {
  let ext = path.extname(address);
  const { hostname, pathname } = url.parse(address);
  if (!ext) {
    ext = '.html';
  }
  const fileName = `${hostname || ''}${pathname}`.replace(ext, '').replace(/\W/g, '-');
  const resType = resTypes[ext];
  return { fileName: `${fileName}${ext}`, pathToSourceFiles: `${fileName}_files`, resType };
};

const loadPage = (address, pathToSave = '') => {
  const { fileName, pathToSourceFiles } = normilizefileName(address);
  const { host } = url.parse(address);
  axios.defaults.host = host;
  let res;
  let $;
  const newDir = path.resolve(pathToSave, pathToSourceFiles);
  loadDebug(`normilizefileName: ${fileName}, ${pathToSourceFiles}. host: ${host}`);
  return axios.get(address)
    .then((response) => {
      res = response;
    })
    .then(() => fsPromises.mkdir(newDir))
    .then(() => {
      loadDebug(`We make dir: ${newDir}`);
      $ = cheerio.load(res.data);
      const tags = $('script[src^="/"], link[href^="/"], img[src^="/"]');
      return tags.each((i, el) => {
        const link = $(el).attr(tagsTypes[el.name]);
        loadDebug(`Work with link: ${link}`);
        const localAdress = new URL(link, address).href;
        const localFileName = normilizefileName(link).fileName.slice(1);
        const responseType = normilizefileName(link).resType;
        const newPath = path.join(pathToSourceFiles, localFileName);
        $(el).attr(tagsTypes[el.name], newPath);
        return axios({
          method: 'get',
          url: localAdress,
          responseType,
        })
          .then(response => fsPromises.writeFile(path.resolve(pathToSave, newPath), response.data))
          .then(() => loadDebug(`We create source file: ${newPath}`));
      });
    })
    .then(() => fsPromises.writeFile(path.resolve(pathToSave, fileName), $.html()))
    .then(() => loadDebug(`We create main file: ${fileName}`))
    .catch((error) => {
      loadDebug(`ERROR: ${error}`);
      throw error;
    });
};

export default loadPage;
