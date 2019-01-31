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
  // console.log(address);
  let ext = path.extname(address);
  const { hostname, pathname } = url.parse(address);
  // console.log(ext);
  if (!ext) {
    ext = '.html';
  }
  // console.log('AAAAAAAA', hostname, 'AAAAAAAAAA', pathname);
  const fileName = `${hostname || ''}${pathname}`.replace(ext, '').replace(/\W/g, '-');
  return { fileName: `${fileName}${ext}`, pathToFiles: `${fileName}_files` };
};

const loadPage = (address, pathToSave = '') => {
  const { fileName, pathToFiles } = normilizefileName(address);
  console.log(fileName);
  const { host, protocol } = url.parse(address);
  // console.log(url.parse(address));
  // console.log(path.resolve(pathToSave, '__fixures'));
  axios.defaults.host = host;
  let res;
  let $;
  return axios.get(address)
    .then((response) => {
      // console.log(response);
      // fsPromises.writeFile(path.resolve(pathToSave, fileName), response.data);
      res = response;
    })
    .then(() => fsPromises.mkdir(path.resolve(pathToSave, pathToFiles)))
    .then(() => {
      $ = cheerio.load(res.data);
      const tags = $('script[src^="/"], link[href^="/"], img[src^="/"]');
      // console.log(tags);
      // const links = [];
      tags.each((i, el) => {
        console.log('EL', el);
        console.log('ЗНАЧЕНИЕ АТРИБУТА', $(el).attr(tagsTypes[el.name]));
        // links.push($(el).attr(tagsTypes[el.name]));
        const lin = $(el).attr(tagsTypes[el.name]);
        const localAdress = new URL(lin, address).href; // `${protocol}//${host}${l}`;
        // console.log(localAdress);
        const localFileName = normilizefileName(lin).fileName.slice(1);
        console.log(localFileName);
        const newPath = path.resolve(pathToSave, pathToFiles, localFileName);
        console.log('%%%%%%% ПУТЬ %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', newPath);
        return axios.get(localAdress)
          .then(response => fsPromises.writeFile(newPath, response.data))
          .then(() => $(el).attr(tagsTypes[el.name], newPath))
          .then(() => console.log('НОВАЯ ССЫЛКА', $(el).attr(tagsTypes[el.name])))
          .then(() => fsPromises.writeFile(path.resolve(pathToSave, fileName), $.html()))
          .catch(console.log);
      });/*
      console.log(links);
      links.map((l) => {
        console.log(host, '&&&&&&', l);
        console.log(new URL(l, address));
        const localAdress = new URL(l, address).href; // `${protocol}//${host}${l}`;
        // console.log(localAdress);
        const localFileName = normilizefileName(l).fileName.slice(1);
        console.log(localFileName);
        const newPath = path.resolve(pathToSave, pathToFiles, localFileName);
        return axios.get(localAdress)
          .then(response => fsPromises.writeFile(newPath, response.data))
          .then(() => )
          .catch(console.log);
      }); */
    })
    .then(() => {
      // console.log($.html());
      return fsPromises.writeFile(path.resolve(pathToSave, fileName), $.html());
    });
};

export default loadPage;
// link, script и img
