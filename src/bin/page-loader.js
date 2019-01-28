#!/usr/bin/env node
import pageloader from 'commander';
import pageLoader from '..';

pageloader
  .version('0.1.1')
  .description('Download web-page from address to path.')
  .option('-o, --output [path]', 'Output path')
  .arguments('[adress]')
  .action(adress => pageLoader(pageloader.output, adress))
  .parse(process.argv);