import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import loadPage from '../src';

const fsPromises = fs.promises;
axios.defaults.adapter = httpAdapter;

const fixturesPath = './__tests__/__fixtures__/';
const sourceFileName = 'cdn-cgi-scripts-5c5dd728-cloudflare-static-email-decode-min.js';
const fileNameBefore = 'before-hexlet-io-courses.html';
const fileNameAfter = 'after-hexlet-io-courses.html';
const fileName = 'hexlet-io-courses.html';
const suorcehDir = 'hexlet-io-courses_files';
let pathToTemp;
let beforeHtmlData;
let afterHtmlData;
let souceFileHtml;

beforeEach(async () => {
  pathToTemp = await fsPromises.mkdtemp(`${os.tmpdir()}${path.sep}`);
  beforeHtmlData = await fsPromises.readFile(path.resolve(fixturesPath, fileNameBefore));
  afterHtmlData = await fsPromises.readFile(path.resolve(fixturesPath, fileNameAfter));
  souceFileHtml = await fsPromises.readFile(path.resolve(fixturesPath, suorcehDir, sourceFileName));
  await nock('https://hexlet.io/')
    .get('/courses')
    .reply(200, beforeHtmlData)
    .get('/courses')
    .reply(200, beforeHtmlData)
    .get('/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js')
    .reply(200, souceFileHtml);
});


test('test https://hexlet.io/courses', async () => {
  await loadPage('https://hexlet.io/courses', pathToTemp);
  const expectData = await fsPromises.readFile(path.join(pathToTemp, fileName));
  expect(expectData.toString()).toEqual(afterHtmlData.toString());
});

test('test source files https://hexlet.io/courses', async () => {
  await loadPage('https://hexlet.io/courses', pathToTemp);
  const pathToResource = path.join(pathToTemp, suorcehDir);
  const expectDataN = await fsPromises.readFile(path.join(pathToResource, sourceFileName));
  expect(expectDataN.toString()).toEqual(souceFileHtml.toString());
});
