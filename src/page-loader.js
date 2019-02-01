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

const makeName = (address) => {
  const ext = path.extname(address) || '.html';
  const { hostname, pathname } = url.parse(address);
  const fileName = path.join(hostname || '', pathname).replace(ext, '').replace(/\W/g, '-');
  const resType = resTypes[ext];
  return { fileName: `${fileName}${ext}`, sourcesPath: `${fileName}_files`, resType };
};

const rewriteHtml = (htmlData, pathToFile) => {
  const $ = cheerio.load(htmlData);
  const tags = $('script[src^="/"], link[href^="/"], img[src^="/"]');
  const links = [];
  tags.each((i, el) => {
    const link = $(el).attr(tagsTypes[el.name]);
    logDebug(`Work with link: ${link}`);
    links.push(link);
    const normilizedName = makeName(link);
    const { fileName } = normilizedName;
    const newPath = path.join(pathToFile, fileName.slice(1));
    $(el).attr(tagsTypes[el.name], newPath);
  });
  logDebug(`Is $ OK?: ${$}`);
  return { links, $ };
};

const loadPage = (address, pathToSave = '') => {
  const { fileName, sourcesPath } = makeName(address);
  const newDir = path.resolve(pathToSave, sourcesPath);
  let res;
  let html;
  logDebug(`makeName: ${fileName}, ${sourcesPath}.`);
  return axios.get(address)
    .then((response) => {
      res = response;
    })
    .then(() => fsPromises.mkdir(newDir))
    .then(() => {
      const { $, links } = rewriteHtml(res.data, sourcesPath);
      html = $;
      const promises = links.map((link) => {
        const linkUrl = new URL(link, address);
        const { href } = linkUrl;
        const linkName = makeName(link);
        const { resType } = linkName;
        const newPath = path.join(sourcesPath, linkName.fileName.slice(1));
        return axios({ method: 'get', url: href, resType })
          .then(response => fsPromises.writeFile(path.resolve(pathToSave, newPath), response.data))
          .then(() => logDebug(`We create source file: ${newPath}`));
      });
      return Promise.all(promises);
    })
    .then(() => fsPromises.writeFile(path.resolve(pathToSave, fileName), html.html()))
    .then(() => logDebug(`We create main file: ${fileName}`))
    .catch((error) => {
      logDebug(`ERROR: ${error}`);
      throw error;
    });
};

export default loadPage;
