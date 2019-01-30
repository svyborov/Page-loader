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
const fileName = 'hexlet-io-courses.html';
let pathToTemp;
let htmlData;

beforeEach(async () => {
  pathToTemp = await fsPromises.mkdtemp(`${os.tmpdir()}${path.sep}`);
  htmlData = await fsPromises.readFile(path.resolve(pathToFixture, fileName));
  nock('https://hexlet.io/')
    .get('/courses')
    .reply(200, htmlData);
});

test('test https://hexlet.io/courses', async () => {
  await loadPage('https://hexlet.io/courses', pathToTemp);
  const expectData = await fsPromises.readFile(path.resolve(pathToTemp, fileName));
  expect(expectData.toString()).toEqual(htmlData.toString());
});
