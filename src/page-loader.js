import axios from 'axios';
import fs from 'fs';
import url from 'url';
import path from 'path';
import cheerio from 'cheerio';
import debug from 'debug';
import Listr from 'listr';

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
  ico: 'stream',
};

const errorsCodes = {
  EACCES: 'no access to',
  EEXIST: 'file already exists',
  ENOENT: 'no such file or directory',
  404: 'Not Found',
};

const createErrorMessage = (error) => {
  let message;
  if (error.response) {
    const statusText = error.response.statusText
      ? error.response.statusText : errorsCodes[error.response.status];
    message = `${error.response.config.url} is ${statusText}`;
  } else {
    message = `${errorsCodes[error.code]} ${error.path}`;
  }
  return message;
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
  logDebug(`Rewrite HTML: ${$}`);
  return { links, $ };
};

const makeTask = (title, task) => new Listr([{ title, task }]).run().catch(console.error);

const loadSourceFile = (link, address, pathToSave, sourcesPath) => {
  const linkUrl = new URL(link, address);
  const { href } = linkUrl;
  const linkName = makeName(link);
  const { resType } = linkName;
  const newPath = path.join(sourcesPath, linkName.fileName.slice(1));
  return axios({ method: 'get', url: href, resType })
    .then(response => fsPromises.writeFile(path.resolve(pathToSave, newPath), response.data))
    .then(() => logDebug(`We create source file: ${newPath}`));
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
      const tasks = [];
      links.forEach(link => tasks.push({ title: `Download page ${link}`, task: () => loadSourceFile(link, address, pathToSave, sourcesPath) }));
      const loadingPages = new Listr(tasks, { concurrent: true });
      return makeTask('Download source pages', () => loadingPages);
    })
    .then(() => makeTask(`Write main file: ${fileName}`, () => fsPromises.writeFile(path.resolve(pathToSave, fileName), html.html())))
    .catch((err) => {
      const message = createErrorMessage(err);
      logDebug(`ERROR: ${message}`);
      throw message;
    });
};

export default loadPage;
