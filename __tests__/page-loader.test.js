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
const fileNameBefore = 'before-hexlet-io-courses.html';
const fileNameAfter = 'after-hexlet-io-courses.html';
const fileName = 'hexlet-io-courses.html';
const qwe = 'hexlet-io-courses_files';
let pathToTemp;
let beforeHtmlData;
let afterHtmlData;
let testData;

beforeEach(async () => {
  pathToTemp = await fsPromises.mkdtemp(`${os.tmpdir()}${path.sep}`);
  beforeHtmlData = await fsPromises.readFile(path.resolve(pathToFixture, fileNameBefore));
  afterHtmlData = await fsPromises.readFile(path.resolve(pathToFixture, fileNameAfter));
  testData = await fsPromises.readFile(path.resolve(pathToFixture, qwe, testFile));
  await nock('https://hexlet.io/')
    .get('/courses')
    .reply(200, beforeHtmlData);

  await nock('https://hexlet.io/')
    .get('/courses')
    .reply(200, beforeHtmlData);

  await nock('https://hexlet.io/')
    .get('/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js')
    .reply(200, testData);
});


test('test https://hexlet.io/courses', async () => {
  await loadPage('https://hexlet.io/courses', pathToTemp);
  const expectData = await fsPromises.readFile(path.resolve(pathToTemp, fileName));
  expect(expectData.toString()).toEqual(afterHtmlData.toString());
});

test('test source https://hexlet.io/courses', async () => {
  await loadPage('https://hexlet.io/courses', pathToTemp);
  const pathToResource = path.join(pathToTemp, qwe);
  const expectDataN = await fsPromises.readFile(path.resolve(pathToResource, testFile));
  expect(expectDataN.toString()).toEqual(testData.toString());
});
