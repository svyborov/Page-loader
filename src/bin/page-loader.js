#!/usr/bin/env node
import pageLoader from '../page-loader';

pageLoader('qwe', 'zxc');
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
