#!/usr/bin/env node

import { Command } from 'commander'
import { version } from '../package.json'
import { FilesystemDatasource } from './datasources/filesystem/filesystem'

const program = new Command()

program
  .description('A CLI tool for bundling files, git repositories, and websites into a single file for LLM consumption')
  .version(version)
  .option('--tokenizer <tokenizer>', 'Specify the tokenizer to use for counting tokens')
  .option('--template <template>', 'Specify the per-file template to use', '<{{ file_path }}>\n{{ file_contents }}\n</{{ file_path }}>')

program
  .command('file <input>')
  .description('Bundle a file or directory')
  .option('--include <patterns...>', 'Include files matching these glob patterns', '**/*')
  .option('--exclude <patterns...>', 'Exclude files matching these glob patterns')
  .action(async (input: string, options: { include: string[], exclude: string[] }, cmd: Command) => {
    try {
      const datasource = new FilesystemDatasource(input, options.include, options.exclude)
      const content = await datasource.getContent()
      const template = cmd.opts().template
      const filePaths = Object.keys(content)
      const output = filePaths.map(filePath => {
        return template
          .replace('{{ file_path }}', filePath)
          .replace('{{ file_contents }}', content[filePath])
      }).join('\n')
      console.log(output)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`)
      } else {
        console.error('An unknown error occurred:', error)
      }
      process.exit(1)
    }
  })

program.parse(process.argv)
