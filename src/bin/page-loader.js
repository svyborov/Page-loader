#!/usr/bin/env node
import pageLoader from '../page-loader';

const standardPath = '/home/plotno/Рабочий стол/TestPageLoader/';
//const standardAddress = 'https://hexlet.io/courses'
const standardAddress = 'https://www.4chords.ru/2018/10/akkordi-dispetchera-2000-baksov-za-sigaretu.html'

pageLoader(standardPath, standardAddress);
/*
import pageLoader from 'commander';


pageLoader
  .version('0.1.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('[pathBefore] [pathAfter]')
  .action((pathBefore, pathAfter) => console.log(genDiff(pathBefore, pathAfter, gendiff.format)))
  .parse(process.argv);
*/
