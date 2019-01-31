import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import loadPage from '../src';

const fsPromises = fs.promises;
axios.defaults.adapter = httpAdapter;
const pathToFixture = './__tests__/__fixtures__/';
const testFile = 'cdn-cgi-scripts-5c5dd728-cloudflare-static-email-decode-min.js';
// const testFile2 = 'courses.html';
const fileName = 'hexlet-io-courses.html';
let pathToTemp;
let htmlData;
let testData;

beforeEach(async () => {
  pathToTemp = await fsPromises.mkdtemp(`${os.tmpdir()}${path.sep}`);
  htmlData = await fsPromises.readFile(path.resolve(pathToFixture, fileName));
  console.log(`${pathToFixture}hexlet-io-courses_files/`);
  testData = await fsPromises.readFile(path.resolve(`${pathToFixture}hexlet-io-courses_files/`, testFile));
  nock('https://hexlet.io/')
    .get('/courses')
    .reply(200, htmlData)
    .get('cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js')
    .reply(200, testData);
});


test('test https://hexlet.io/courses', async () => {
  await loadPage('https://hexlet.io/courses', pathToTemp);
  const expectData = await fsPromises.readFile(path.resolve(pathToTemp, fileName));
  const expectDataN = await fsPromises.readFile(path.resolve(`${pathToTemp}/hexlet-io-courses_files/`, testFile));
  expect(expectData.toString()).toEqual(htmlData.toString());
  expect(expectDataN.toString()).toEqual(testData.toString());
});
