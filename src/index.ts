#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description('A CLI tool for bundling files, git repositories, and websites into a single file for LLM consumption')
  .parse(process.argv);

const options = program.opts();
