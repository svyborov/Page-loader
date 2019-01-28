import axios from 'axios';
// import httpAdapter from 'axios/lib/adapters/http';

const standardPath = '/home/plotno/projects/page-loader/Test/';
const host = 'https://hexlet.io';

// axios.defaults.adapter = httpAdapter;
axios.defaults.host = host;

const pageLoader = (path = standardPath, address) => {
  console.log(path);
  console.log(address);
  console.log(axios);
  axios.get('/courses')
    .then((response) => {
      console.log(response);
    });
};

export default pageLoader;
