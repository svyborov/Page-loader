import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import pageLoader from '../src';

const fsPromises = fs.promises;
axios.defaults.adapter = httpAdapter;
const pathToFixture = './__tests__/__fixtures__/hexlet-io-courses.html';
let pathToTemp;
let htmlData;

beforeEach(async () => {
  pathToTemp = await fsPromises.mkdtemp(`${os.tmpdir()}${path.sep}`);
  htmlData = await fsPromises.readFile(pathToFixture);
});

test('test https://hexlet.io/courses', async () => {
  expect.assertions(1);
  nock('https://hexlet.io/')
    .get('/courses')
    .reply(200, htmlData);
  const pathToTestFile = await pageLoader(`${pathToTemp}/`, 'https://hexlet.io/courses');
  const expectData = await fsPromises.readFile(pathToTestFile);
  expect(expectData.toString()).toEqual(htmlData.toString());
});
