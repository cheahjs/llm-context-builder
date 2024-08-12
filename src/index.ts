#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';

const program = new Command();

program
  .description('A CLI tool for bundling files, git repositories, and websites into a single file for LLM consumption')
  .version(version)
  .option('--tokenizer <tokenizer>', 'Specify the tokenizer to use for counting tokens');

program
  .command('git <input>')
  .description('Bundle a git repository')
  .option('--include <patterns...>', 'Include files matching these glob patterns')
  .option('--exclude <patterns...>', 'Exclude files matching these glob patterns')
  .action((input, options) => {
    // TODO: Implement logic to handle the git input and options
  });

program
  .command('file <input>')
  .description('Bundle a file or directory')
  .option('--include <patterns...>', 'Include files matching these glob patterns')
  .option('--exclude <patterns...>', 'Exclude files matching these glob patterns')
  .action((input, options) => {
    // TODO: Implement logic to handle the file input and options
  });

program
  .command('web <input>')
  .description('Bundle a website')
  .option('--include <patterns...>', 'Include files matching these glob patterns')
  .option('--exclude <patterns...>', 'Exclude files matching these glob patterns')
  .action((input, options) => {
    // TODO: Implement logic to handle the web input and options
  });

program.parse(process.argv);
