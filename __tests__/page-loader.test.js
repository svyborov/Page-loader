import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'fs';
import url from 'url';
import pageLoader from '../src'
import os from 'os';

//const host = 'http://localhost';

//axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

test('adds 1 + 2 to equal 3', () => {
  expect(3).toBe(3);
});

test('test hexlet.io', () => {
  const dir = os.tmpdir();
  console.log(dir);
  nock('https://hexlet.io/')
    .get('/courses')
    .reply(200, 'test data');
  const data = pageLoader(`${dir}/`, 'https://hexlet.io/courses');
  data.then(qwe => fs.promises.readFile(qwe).then(zxc => console.log(zxc.toString())));
  /*
  axios.get('/test').then(response => {
    expect(response.data).to.be.equal('test data');
    done();
  }); */
  expect('peanut butter').toBe('peanut butter');
});
/*
test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
*/
