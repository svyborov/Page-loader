#!/usr/bin/env node
import pageloader from 'commander';
import loadPage from '..';

pageloader
  .version('0.1.1')
  .description('Download web-page from address to path.')
  .option('-o, --output [path]', 'Output path')
  .arguments('[adress]')
  .action(adress => loadPage(adress, pageloader.output))
  .parse(process.argv);
