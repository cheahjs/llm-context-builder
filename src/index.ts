#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description('A CLI tool for bundling files, git repositories, and websites into a single file for LLM consumption')
  .arguments('<input>')
  .option('--type <type>', 'Specify the type of input (one of git, filesystem, web)')
  .option('--include <patterns...>', 'Include files matching these glob patterns')
  .option('--exclude <patterns...>', 'Exclude files matching these glob patterns')
  .parse(process.argv);

const options = program.opts();
const input = program.args[0];

// TODO: Implement logic to handle the input and options
