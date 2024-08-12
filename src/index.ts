#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';
import { FilesystemDatasource } from './datasources/filesystem/filesystem';

const program = new Command();

program
  .description('A CLI tool for bundling files, git repositories, and websites into a single file for LLM consumption')
  .version(version)
  .option('--tokenizer <tokenizer>', 'Specify the tokenizer to use for counting tokens');

program
  .command('file <input>')
  .description('Bundle a file or directory')
  .option('--include <patterns...>', 'Include files matching these glob patterns')
  .option('--exclude <patterns...>', 'Exclude files matching these glob patterns')
  .action(async (input, options) => {
    try {
      const datasource = new FilesystemDatasource(input, options.include, options.exclude);
      const content = await datasource.getContent();
      console.log(content);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error('An unknown error occurred:', error);
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
