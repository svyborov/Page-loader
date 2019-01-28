import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'fs';
import url from 'url';

axios.defaults.adapter = httpAdapter;
const fsPromises = fs.promises;

const pageLoader = (path, address) => {
  console.log(fsPromises);
  console.log(path);
  console.log(address);
  console.log(axios);
  const regex = RegExp(/\w/);
  const parsedAddress = url.parse(address);
  const shortAddress = parsedAddress.host + parsedAddress.path;
  const fileName = shortAddress.split('').reduce((acc, s) => (regex.test(s) ? acc + s : `${acc}-`), '');
  axios.get(address)
    .then((response) => {
      console.log(response.data);
      fsPromises.writeFile(`${path}${fileName}.html`, response.data)
        .then(() => {
          console.log(parsedAddress);
          console.log('%%%DONE%%%');
        });
    });
};

export default pageLoader;
