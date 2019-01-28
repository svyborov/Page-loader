#!/usr/bin/env node
import page-loader from 'commander';
import { genDiff } from '..';

page-loader
  .version('0.1.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('[pathBefore] [pathAfter]')
  .action((pathBefore, pathAfter) => console.log(genDiff(pathBefore, pathAfter, gendiff.format)))
  .parse(process.argv);
