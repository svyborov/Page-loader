import axios from 'axios';
import fs from 'fs';
import url from 'url';
import path from 'path';
import cheerio from 'cheerio';
import debug from 'debug';

const logDebug = debug('page-loader');

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
  const ext = path.extname(address) || '.html';
  const { hostname, pathname } = url.parse(address);
  const fileName = path.join(hostname || '', pathname).replace(ext, '').replace(/\W/g, '-');
  const resType = resTypes[ext];
  return { fileName: `${fileName}${ext}`, pathToSourceFiles: `${fileName}_files`, resType };
};

const getLinks = (htmlData, pathToFile) => {
  const $ = cheerio.load(htmlData);
  const tags = $('script[src^="/"], link[href^="/"], img[src^="/"]');
  let pathsAndNames;
  const links = [];
  tags.each((i, el) => {
    const link = $(el).attr(tagsTypes[el.name]);
    logDebug(`Work with link: ${link}`);
    links.push(link);
    // const { href } = new URL(link, address);
    pathsAndNames = normilizefileName(link);
    const localFileName = pathsAndNames.fileName.slice(1);
    // const { resType } = pathsAndNames;
    const newPath = path.join(pathToFile, localFileName);
    $(el).attr(tagsTypes[el.name], newPath);
  });
  return { pathsAndNames, links };
};

const loadPage = (address, pathToSave = '') => {
  const { fileName, pathToSourceFiles } = normilizefileName(address);
  const { host } = url.parse(address);
  let res;
  let $;
  const newDir = path.resolve(pathToSave, pathToSourceFiles);
  logDebug(`normilizefileName: ${fileName}, ${pathToSourceFiles}. host: ${host}`);
  return axios.get(address)
    .then((response) => {
      res = response;
    })
    .then(() => fsPromises.mkdir(newDir))
    .then(() => {
      logDebug(`We make dir: ${newDir}`);
      $ = cheerio.load(res.data);
      const tags = $('script[src^="/"], link[href^="/"], img[src^="/"]');
      tags.each((i, el) => {
        const link = $(el).attr(tagsTypes[el.name]);
        logDebug(`Work with link: ${link}`);
        const { href } = new URL(link, address);
        const localNormilizeFile = normilizefileName(link);
        const localFileName = localNormilizeFile.fileName.slice(1);
        const { resType } = localNormilizeFile;
        const newPath = path.join(pathToSourceFiles, localFileName);
        $(el).attr(tagsTypes[el.name], newPath);
        return axios({
          method: 'get',
          url: href,
          resType,
        })
          .then(response => fsPromises.writeFile(path.resolve(pathToSave, newPath), response.data))
          .then(() => logDebug(`We create source file: ${newPath}`));
      });
    })
    .then(() => fsPromises.writeFile(path.resolve(pathToSave, fileName), $.html()))
    .then(() => logDebug(`We create main file: ${fileName}`))
    .catch((error) => {
      logDebug(`ERROR: ${error}`);
      throw error;
    });
};

export default loadPage;
